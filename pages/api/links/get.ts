import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { Link } from "../../dashboard";

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
  if (!body?.repoIds) {
    res.status(400).json({ error: "Missing repoIds" });
    return;
  }
  const links: Link[] = await prisma.link.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    where: {
      userId: session.userId as string,
      repoId: {
        in: body.repoIds,
      },
    },
    select: {
      id: true,
      repoId: true,
      revoked: true,
      _count: {
        select: {
          uses: true,
        },
      },
    },
  });
  console.log("get", links);
  res.status(200).json(links);
}
