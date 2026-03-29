import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = (await db.adminUser.findUnique({
                    where: { email: credentials.email },
                })) as any;

                if (!user || user.isActive === false) {
                    throw new Error("Invalid login attempt");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

                if (!isPasswordValid) {
                    throw new Error("Invalid login attempt"); // Keep error message general for security
                }

                // Return the user object, mapped to NextAuth's expected JWT format
                return {
                    id: user.id,
                    email: user.email,
                    name: user.fullName,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // If user object is passed (first sign in), append role and id to the token
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            // Make the user ID and role available on the session object
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 Days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/admin/login", // Assuming a custom login page exists on the frontend at /admin/login
    },
};
