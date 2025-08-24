//It contains all the credential programmes and providers which is used to provide login on the basis of gmail, github, etc.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("Invalid credentials");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid Password");
          }
          return user;
        } catch (error: any) {
          throw new Error("Invalid credentials" + error.message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
        if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.username = token.username;
            session.user.accBalance = token.accBalance;
            session.user.fullname = token.fullname;
            session.user.email = token.email;
        }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token._id = user._id?.toString();
            token.email = user.email;
            token.fullname = user.fullname;
            token.isVerified = user.isVerified;
            token.username = user.username;
            token.accBalance = user.accBalance;
        }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
