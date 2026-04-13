import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días de persistencia
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {

                    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    const { data } = await res.json();

                    if (res.ok) {
                        return {
                            id: data.id.toString(),
                            name: data.full_name,
                            email: data.email,
                            accessToken: data.token,
                            role: data.role,
                            businessId: data.businessId,
                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.accessToken = user.accessToken
                token.role = user.role
                token.businessId = user.businessId
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken
                session.user.id = token.id
                session.user.role = token.role
                session.user.businessId = token.businessId
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60, // Persistencia de la cookie
            },
        },
    },
}
