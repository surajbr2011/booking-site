import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres.wmmcnkrsjsnpvqoatsph:Exoticadatabas@db.wmmcnkrsjsnpvqoatsph.supabase.co:5432/postgres?sslmode=require";

async function test() {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('Connecting to Supabase using pg driver...');
    await client.connect();
    console.log('SUCCESS: Connected to Supabase!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from DB:', res.rows[0]);
  } catch (err) {
    console.error('PG CONNECTION FAILED:');
    console.error(err);
  } finally {
    await client.end();
  }
}

test();
