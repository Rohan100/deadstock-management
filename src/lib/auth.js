import CredentialsProvider from "next-auth/providers/credentials"
import db from '@/db'
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "username", type: 'text' },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing required fields")
                }
                try {
                    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, credentials.username))
                    if (!user) {
                        throw new Error("User not found")
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        throw new Error("Incorrect Username or password")
                    }
                    return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        name: user.name
                    }
                } catch (err) {
                    console.log(err)
                    throw err
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
    pages:{
        signIn:"/login",
        error:"/login"
    },
    secret : process.env.NEXTAUTH_SECRET

}