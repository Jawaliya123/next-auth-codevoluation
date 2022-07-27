import EmailProvider from "next-auth/providers/email";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";
import clientPromise from "./lib/mongodb";
import Users from "../../../models/userModel";
import connectDB from "../../../config/connectDB";

connectDB();

const gitHubProvider: any = {
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
};

const googleProvider: any = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

const facebookProvider: any = {
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
};

const auth0Provider: any = {
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuer: process.env.AUTH0_ISSUER,
};

const signInUser = async ({ password, user }: any) => {
  if (!user.password) {
    throw new Error("Please Enter the password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password not correct");
  }
  return user;
};

const credentialsProvider: any = {
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials: any, req: any) {
    const email = credentials.email;
    const password = credentials.password;
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("You haven't registered yet");
    }
    if (user) {
      return signInUser({ password, user });
    }
  },
};

export default NextAuth({
  providers: [
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    GitHubProvider(gitHubProvider),
    GoogleProvider(googleProvider),
    FacebookProvider(facebookProvider),
    Auth0Provider(auth0Provider),
    CredentialsProvider(credentialsProvider),
  ],
  // adapter: MongoDBAdapter(clientPromise),
  // database: process.env.DB_URL,
  // session: {
  //   jwt: true,
  // },
  jwt: {
    secret: "secret",
  },
  pages: { signIn: "/signin" },
});
