import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            full_name: string
            email: string
            role: string
            accessToken: string
            businessId: string
        } & DefaultSession['user']
    }

    interface User {
        id: string
        accessToken: string
        role: string
        businessId: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        role: string
        businessId: string
    }
}

