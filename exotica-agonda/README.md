# Exotica Agonda - Backend Development Project Report

## 1. Project Objectives
The objective of this project was to construct a robust, high-performance, and secure backend infrastructure for the **Exotica Agonda** hotel website. The system manages core hotel operations including dynamic room availability, secure booking preventions, Razorpay payment processing, and comprehensive administrative controls over content, inquiries, and analytics.

---

## 2. Technologies Used
- **Framework:** Next.js 14/15 (App Router, API Routes)
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma v6
- **Authentication:** NextAuth.js (JWT, Credentials Provider, Middleware RBAC)
- **Payment Gateway:** Razorpay SDK
- **Email Service:** SendGrid
- **Image Management:** Cloudinary
- **Validation:** Zod
- **Security:** In-memory LRU Cache (Rate Limiting), custom API Security Middleware (Headers enforcement)

---

## 3. System Architecture & Database Design
The application utilizes a Serverless API architecture driven by Next.js API Routes (`/app/api/...`), connecting to a remote PostgreSQL database via Prisma ORM utilizing connection pooling (`DATABASE_URL`) and direct migrations (`DIRECT_URL`). 

### Core Database Models (`schema.prisma`)
1. **Room:** Manages inventory, pricing, occupancy data, and active presentation states.
2. **Booking:** Core transaction model. Uses `Serializable` isolation transactions to enforce atomic creation and strict double-booking prevention.
3. **Inquiry:** Guest contact tracking.
4. **AdminUser:** RBAC protected administration accounts (housed via `bcrypt` hashing).
5. **ContentPage & GalleryImage:** Headless CMS data storage.

**Optimizations:** Strategically mapped database indices (e.g., `@@index([checkInDate, checkOutDate])`) dramatically improve query traversal for date-range overlap verifications.

---

## 4. Development Timeline & Code Changes

### Week 1 (Sprint 1): Foundation & Core APIs
- **Days 1-2 (Mon-Tue):** Setup Supabase PostgreSQL. Designed comprehensive Prisma schemas and ran initial migrations. Created database seed scripts and configured environmental `.env` variables.
- **Days 3-4 (Wed-Thu):** Built the core logic: `GET /api/rooms` with dynamic filtering/pagination, integrated SendGrid, and deployed the Contact Inquiry handling system (`POST /api/contact`).
- **Days 5-6 (Fri-Sat):** Configured Cloudinary for automatic image optimization via `POST /api/upload`. Implemented global error wrappers (`api-error.ts`), content endpoints, and basic `lru-cache` API rate limiting.

### Week 2 (Sprint 2): Booking System & Payment
- **Days 1-2 (Mon-Tue):** Built the core `POST /api/bookings` endpoint. Implemented deep double-booking prevention utilizing Prisma serializable transactions. Engineered the availability calendar array generator and dynamic pricing/tax calculator.
- **Days 3-4 (Wed-Thu):** Setup Razorpay integration. Engineered `POST /api/payments/create-order` and a secure webhook handler (`POST /api/payments/webhook`) with HMAC SHA256 Signature verification. 
- **Days 5-6 (Fri-Sat):** Attached automated email triggers (Guest Confirmation) to the payment success webhooks. 

### Week 3 (Sprint 3): Admin Panel & Polish
- **Days 1-2 (Mon-Tue):** Implemented `NextAuth.js` with `bcryptjs`. Built `middleware.ts` to strictly enforce role-based access control (RBAC) terminating unauthorized requests to `/api/admin/*`. 
- **Days 3-4 (Wed-Thu):** Built granular management APIs: Dashboard statistical calculations (`GET /api/admin/dashboard`), and complete CRUD lifecycle endpoints for Rooms, Bookings, and Inquiries. Implemented intelligent soft-deletes constraint checking for Rooms.
- **Days 5-6 (Fri-Sat):** Executed a security parameter sweep. Refactored dynamic Next.js parameters (`{ params: Promise<{id}> }`). Engineered a raw algorithmic query for 12-month revenue aggregation (`/api/admin/reports`) and a formatted downloadable CSV Export generator (`/api/admin/export`).

---

## 5. Setup & Running Instructions

Follow these step-by-step instructions to boot the backend environment locally.

### Prerequisites
- Node.js (v18+)
- Active Supabase (PostgreSQL) Database instance
- API Keys for: Razorpay, SendGrid, Cloudinary

### Step 1: Environment Configuration
1. Clone the repository and navigate into `/exotica-agonda`.
2. Open the `.env` file at the root.
3. Ensure the following variables are strictly populated:
\`\`\`env
# Supabase DB
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Auth
NEXTAUTH_SECRET="generate_a_secure_random_string_here"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
SENDGRID_API_KEY="..."
SENDGRID_FROM_EMAIL="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
\`\`\`

### Step 2: Install Dependencies & Database
1. Run `npm install` to install core packages.
2. Initialize the Prisma ORM generation:
   \`\`\`bash
   npx prisma generate
   \`\`\`
3. Push/Sync the schema to your Supabase database:
   \`\`\`bash
   npx prisma db push
   \`\`\`
4. *(Optional but recommended)* Seed the database with default admin accounts and initial room data:
   \`\`\`bash
   node prisma/seed.js
   \`\`\`

### Step 3: Start the Backend Server
Run the Next.js development server:
\`\`\`bash
npm run dev
\`\`\`
- The API will be actively listening at `http://localhost:3000/api/*`.
- Admin endpoints require passing an authenticated NextAuth session cookie (or triggering login via the frontend first).

### Verification
You can verify the system's structural integrity at any point by running a production build check:
\`\`\`bash
npm run build
\`\`\`
*(A successful build indicates that all TypeScript types, Next.js routes, and Prisma queries are cleanly compiled).*
