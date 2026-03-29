import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.DATABASE_URL || "mongodb+srv://surajbr2011_db_user:Suraj%40123@cluster0.6pc7yzv.mongodb.net/exotica_agonda?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&serverSelectionTimeoutMS=30000";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

export async function getDb() {
    const client = await clientPromise;
    return client.db();
}

export { clientPromise, ObjectId };

// Prisma-like Wrapper for MongoDB
class CollectionWrapper {
    constructor(private name: string) {}

    private async getCol() {
        const client = await clientPromise;
        return client.db().collection(this.name);
    }

    private toObjectId(id: string | any) {
        if (typeof id === 'string' && id.length === 24) {
            try { return new ObjectId(id); } catch (e) { return id; }
        }
        return id;
    }

    async findUnique(args: { where: any, include?: any }) {
        const col = await this.getCol();
        const query = { ...args.where };
        if (query.id) {
            query._id = this.toObjectId(query.id);
            delete query.id;
        }
        const doc = await col.findOne(query);
        if (!doc) return null;
        return { ...doc, id: doc._id.toString() };
    }

    async findFirst(args: { where: any }) {
        const col = await this.getCol();
        const query = { ...args.where };
        if (query.id) {
            query._id = this.toObjectId(query.id);
            delete query.id;
        }
        const doc = await col.findOne(query);
        if (!doc) return null;
        return { ...doc, id: doc._id.toString() };
    }

    async findMany(args: { where?: any, skip?: number, take?: number, orderBy?: any }) {
        const col = await this.getCol();
        let query = args.where || {};
        
        // Handle nested Prisma-like conditions (gte, lte, etc.)
        const mongoQuery: any = {};
        for (const key in query) {
            const val = query[key];
            if (val && typeof val === 'object' && !Array.isArray(val) && !ObjectId.isValid(val)) {
                const subQuery: any = {};
                if (val.gte) subQuery.$gte = val.gte;
                if (val.lte) subQuery.$lte = val.lte;
                if (val.lt) subQuery.$lt = val.lt;
                if (val.gt) subQuery.$gt = val.gt;
                if (val.in) subQuery.$in = val.in;
                if (val.notIn) subQuery.$nin = val.notIn;
                
                // Regex for contains
                if (val.contains) {
                    const options = val.mode === 'insensitive' ? 'i' : '';
                    subQuery.$regex = val.contains;
                    if (options) subQuery.$options = options;
                }
                
                mongoQuery[key] = subQuery;
            } else if (key === 'id') {
                mongoQuery._id = this.toObjectId(val);
            } else if (key === 'OR') {
                mongoQuery.$or = val.map((item: any) => {
                    const mapped: any = {};
                    for (const k in item) {
                        const v = item[k];
                        if (k === 'id') {
                            mapped._id = this.toObjectId(v);
                        } else if (v && typeof v === 'object' && v.contains) {
                            const opt = v.mode === 'insensitive' ? 'i' : '';
                            mapped[k] = { $regex: v.contains, $options: opt };
                        } else {
                            mapped[k] = v;
                        }
                    }
                    return mapped;
                });
            } else {
                mongoQuery[key] = val;
            }
        }

        let cursor = col.find(mongoQuery);
        if (args.skip) cursor = cursor.skip(args.skip);
        if (args.take) cursor = cursor.limit(args.take);
        if (args.orderBy) {
            const sort: any = {};
            for (const k in args.orderBy) {
                sort[k] = args.orderBy[k] === 'asc' ? 1 : -1;
            }
            cursor = cursor.sort(sort);
        }

        const docs = await cursor.toArray();
        return docs.map(d => ({ ...d, id: d._id.toString() }));
    }

    async count(args: { where?: any }) {
        const col = await this.getCol();
        return col.countDocuments(args.where || {});
    }

    async create(args: { data: any }) {
        const col = await this.getCol();
        const res = await col.insertOne(args.data);
        return { ...args.data, id: res.insertedId.toString(), _id: res.insertedId };
    }

    async update(args: { where: any, data: any }) {
        const col = await this.getCol();
        const query = { ...args.where };
        if (query.id) {
            query._id = this.toObjectId(query.id);
            delete query.id;
        }
        await col.updateOne(query, { $set: args.data });
        return this.findUnique({ where: args.where });
    }

    async aggregate(args: { _sum: any, where?: any }) {
        const col = await this.getCol();
        const pipeline: any[] = [];
        if (args.where) {
            // Re-use logic for mapping where clause
            const mongoQuery: any = {};
            for (const key in args.where) {
                const val = args.where[key];
                if (val && typeof val === 'object' && !Array.isArray(val) && !ObjectId.isValid(val)) {
                    const subQuery: any = {};
                    if (val.gte) subQuery.$gte = val.gte;
                    if (val.lte) subQuery.$lte = val.lte;
                    mongoQuery[key] = subQuery;
                } else {
                    mongoQuery[key] = val;
                }
            }
            pipeline.push({ $match: mongoQuery });
        }
        
        const project: any = {};
        for (const key in args._sum) {
            project[key] = { $sum: `$${key}` };
        }
        pipeline.push({ $group: { _id: null, ...project } });

        const res = await col.aggregate(pipeline).toArray();
        const result: any = { _sum: {} };
        if (res.length > 0) {
            for (const key in args._sum) {
                result._sum[key] = res[0][key];
            }
        } else {
            for (const key in args._sum) {
                result._sum[key] = 0;
            }
        }
        return result;
    }

    async delete(args: { where: any }) {
        const col = await this.getCol();
        const query = { ...args.where };
        if (query.id) {
            query._id = this.toObjectId(query.id);
            delete query.id;
        }
        return col.deleteOne(query);
    }
}

export const db = {
    room: new CollectionWrapper('rooms'),
    booking: new CollectionWrapper('bookings'),
    inquiry: new CollectionWrapper('inquiries'),
    galleryImage: new CollectionWrapper('gallery_images'),
    review: new CollectionWrapper('reviews'),
    adminUser: new CollectionWrapper('admin_users'),
    contentPage: new CollectionWrapper('content_pages'),
};

export default db;
