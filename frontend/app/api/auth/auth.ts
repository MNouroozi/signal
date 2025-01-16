// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = { id: 1, email: credentials?.email };
                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
