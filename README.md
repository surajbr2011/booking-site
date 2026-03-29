
# Exotica Hotel Booking Project

Welcome to the **Exotica Hotel Booking** project! This repository contains a full-stack hotel management and booking system.

## Project Structure

This project is organized as a monorepo with two main components:

*   **[exotica-agonda](./exotica-agonda)**: The backend API and admin dashboard system.
*   **[exotica-next](./exotica-next)**: The frontend user interface built with Next.js.

## Getting Started

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or yarn
*   Git

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/trinixitsolutions-dev/booking-site.git
    cd Exotica-Hotel-Booking
    ```

2.  Install dependencies for both projects:
    ```bash
    # For exotica-agonda
    cd exotica-agonda
    npm install
    cd ..

    # For exotica-next
    cd exotica-next
    npm install
    cd ..
    ```

3.  Set up environment variables:
    Create a `.env` file in both `exotica-agonda` and `exotica-next` (refer to `.env.example` if available).

### Running Locally

To start the development servers:

```bash
# Start exotica-agonda
cd exotica-agonda
npm run dev

# Start exotica-next
cd exotica-next
npm run dev
```

## Technologies Used

*   **Frontend**: Next.js, React, Tailwind CSS
*   **Backend**: Node.js, Next.js API Routes, Prisma
*   **Database**: PostgreSQL / MongoDB (depending on setup)

## License

Copyright © 2026 Trinix IT Solutions. All rights reserved.
=======
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
>>>>>>> ab8b8f7ac984d74626208cd55eaad639425b14f4
