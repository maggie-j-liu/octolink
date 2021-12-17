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
  if (!body?.id) {
    res.status(400).json({ error: "Missing id" });
    return;
  }
  // get only the uses
  const links = await prisma.link.findUnique({
    where: {
      id: body.id,
    },
    select: {
      uses: {
        select: {
          user: {
            select: {
              githubUsername: true,
            },
          },
        },
      },
    },
  });
  // console.log("get-uses", links);
  res.status(200).json(links);
}
