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
  const { id, revoked }: { id: string; revoked: boolean } = JSON.parse(
    req.body
  );
  if (!id) {
    res.status(400).json({ error: "missing link id or revoked" });
    return;
  }
  await prisma.link.update({
    where: {
      id,
    },
    data: {
      revoked,
    },
  });
  res.status(200).end();
}
