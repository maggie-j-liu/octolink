import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import accessToken from "../../../lib/accessToken";
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
  const { id }: { id: string } = JSON.parse(req.body);
  if (!id) {
    res.status(400).json({ error: "missing link id" });
    return;
  }
  const link = await prisma.link.findUnique({
    where: {
      id,
    },
    select: {
      repo: true,
      user: {
        include: {
          accounts: true,
        },
      },
    },
  });
  if (!link) {
    res.status(404).json({ error: "link not found" });
    return;
  }
  const token = link?.user.accounts[0].access_token;
  const result = await fetch(
    `https://api.github.com/repos/${link.repo}/collaborators/${
      session?.githubUsername as string
    }`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        accept: "application/vnd.github.v3+json",
      },
    }
  );

  console.log(result.status);
  const json = await result.json();
  const invitationId = json.id;

  const userToken = await accessToken(session?.userId as string);

  const inviteResult = await fetch(
    `https://api.github.com/user/repository_invitations/${invitationId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `token ${userToken}`,
        accept: "application/vnd.github.v3+json",
      },
    }
  );
  console.log(inviteResult.status);

  res.status(200).end();
}
