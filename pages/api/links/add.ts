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
  const { repo }: { repo: string } = JSON.parse(req.body);
  if (!repo) {
    res.status(400).json({ error: "missing repo" });
    return;
  }
  const link = await prisma.link.create({
    data: {
      userId: session.userId as string,
      repo,
    },
  });
  res.status(200).json(link);
}
