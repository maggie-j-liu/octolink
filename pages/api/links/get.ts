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
  let id = undefined;
  if (req.body) {
    id = JSON.parse(req.body).id;
  }
  let links;
  if (id) {
    // get only the uses
    links = await prisma.link.findUnique({
      where: {
        id,
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
    console.log(links);
  } else {
    links = await prisma.link.findMany({
      where: {
        userId: session.userId as string,
      },
      include: {
        _count: {
          select: {
            uses: true,
          },
        },
      },
    });
  }
  res.status(200).json(links);
}
