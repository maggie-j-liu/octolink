import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import accessToken from "../../../lib/accessToken";
import createUrl from "../../../lib/createUrl";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.redirect("/404");
    return;
  }
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const token = await accessToken(session.userId as string);
  const repos = await fetch(
    createUrl("https://api.github.com/user/repos", {
      affiliation: "owner",
      sort: "updated",
    }),
    {
      headers: {
        Authorization: `token ${token}`,
        accept: "application/vnd.github.v3+json",
      },
    }
  ).then((res) => res.json());
  res.status(200).json(repos);
}
