import CredentialsProviderModule from "next-auth/providers/credentials"
import db from '@/db'
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from 'bcryptjs';

const CredentialsProvider = CredentialsProviderModule.default || CredentialsProviderModule;

const toSessionUser = (user) => ({
    id: String(user.id),
    username: user.username,
    email: user.email,
    name: user.name,
    isAdmin: Boolean(user.isAdmin),
    role: user.isAdmin ? "Admin" : "User",
    isEnabled: Boolean(user.isEnabled),
});

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
                    if (!user.isEnabled) {
                        throw new Error("Your account has been disabled")
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isValid) {
                        throw new Error("Incorrect Username or password")
                    }
                    return toSessionUser(user)
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
                token.isAdmin = user.isAdmin;
                token.role = user.role;
                token.isEnabled = user.isEnabled;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.isAdmin = Boolean(token.isAdmin);
                session.user.role = token.role || (token.isAdmin ? "Admin" : "User");
                session.user.isEnabled = token.isEnabled !== false;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
    pages:{
        signIn:"/auth/login",
        error:"/auth/login"
    },
    secret : process.env.NEXTAUTH_SECRET

}
