import { Link } from "@prisma/client";
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
  const { repoId, repoName }: { repoId: number; repoName: string } = JSON.parse(
    req.body
  );
  if (!repoId) {
    res.status(400).json({ error: "missing repoId" });
    return;
  }
  const link = await prisma.link.create({
    data: {
      userId: session.userId as string,
      repoId,
      repoName,
    },
  });
  const withCount: Link & { _count: { uses: number } } = {
    ...link,
    _count: { uses: 0 },
  };

  // console.log("add", withCount);
  res.status(200).json(withCount);
}
