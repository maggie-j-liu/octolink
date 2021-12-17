import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
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
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const body = JSON.parse(req.body);
  if (!body?.repos) {
    res.status(400).json({ error: "Missing repos" });
    return;
  }
  const links = await prisma.link.findMany({
    where: {
      userId: session.userId as string,
      repo: {
        in: body.repos,
      },
    },
    include: {
      _count: {
        select: {
          uses: true,
        },
      },
    },
  });
  // console.log("get", links);
  res.status(200).json(links);
}
