import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { params: { scope: "read:user user:email repo" } },
      profile(profile) {
        console.log("here");
        return {
          id: profile.id.toString(),
          githubId: profile.id.toString(),
          githubUsername: profile.login,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  secret: process.env.SECRET as string,
});

/*
const accounts = await prisma.user.findUnique({
  where: {
    id: user.id,
  },
  select: {
    accounts: true,
  },
});
const accessToken = accounts?.accounts[0]?.access_token;
*/
