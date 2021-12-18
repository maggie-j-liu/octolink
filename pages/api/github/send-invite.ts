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
      repoId: true,
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
    `https://api.github.com/repositories/${link.repoId}/collaborators/${
      session?.githubUsername as string
    }`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        accept: "application/vnd.github.v3+json",
        "Content-Length": "0",
      },
    }
  );

  // console.log(result.status);

  // already collaborator
  if (result.status === 204) {
    res.status(204).end();
    return;
  }

  const json = await result.json();

  // an error
  if (result.status !== 201) {
    res.status(400).json({ error: json.message });
    return;
  }

  const invitationId = json.id;
  const userToken = await accessToken(session?.userId as string);

  // accept the invitation
  const invitePromise = fetch(
    `https://api.github.com/user/repository_invitations/${invitationId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `token ${userToken}`,
        accept: "application/vnd.github.v3+json",
      },
    }
  );

  // add this use to the db
  const dbPromise = await prisma.use.create({
    data: {
      userId: session?.userId as string,
      linkId: id,
    },
  });

  const [inviteResult] = await Promise.all([invitePromise, dbPromise]);

  // console.log(inviteResult.status);

  res.status(200).end();
}
