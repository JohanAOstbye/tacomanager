import NextAuth from 'next-auth'
import { compare, hash, genSalt } from 'bcryptjs'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../lib/mongodb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const client = await clientPromise
        let user = await client
          .db()
          .collection('users')
          .findOne({ username: credentials.username })
        const salt = await genSalt(10)

        if (!user) {
          // create the user
          const newUser = credentials
          newUser.password = await hash(credentials.password, salt)

          const id = (await client.db().collection('users').insertOne(newUser))
            .insertedId
          user = await client.db().collection('users').findOne({ _id: id })
          return user
        }

        const PasswordMatch = await compare(credentials.password, user.password)
        if (!PasswordMatch) {
          throw new Error('No user found with the username and password')
        }

        delete user.password

        return user
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user = user
      session.token = token
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: 'light',
    brandColor: '3b82f6',
    logo: '/images/taco.png',
  },
  adapter: MongoDBAdapter(clientPromise),
  debug: true,
  session: {
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60,
  },
  pages: {
    newUser: '/auth/new-user',
  },
})
