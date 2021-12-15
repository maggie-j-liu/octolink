import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import accessToken from "../../../lib/accessToken";
import createUrl from "../../../lib/createUrl";
import parseLinkHeader from "parse-link-header";

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
  const { page }: { page: number } = JSON.parse(req.body);
  if (!page) {
    res.status(400).json({ error: "missing page" });
    return;
  }
  const token = await accessToken(session.userId as string);
  const result = await fetch(
    createUrl("https://api.github.com/user/repos", {
      affiliation: "owner",
      sort: "updated",
      page: page.toString(),
    }),
    {
      headers: {
        Authorization: `token ${token}`,
        accept: "application/vnd.github.v3+json",
      },
    }
  );
  let last = page;
  const linkHeaders = parseLinkHeader(result.headers.get("Link"));
  // has more pages
  if (linkHeaders && linkHeaders.last) {
    last = parseInt(linkHeaders.last.page);
  }

  const repos = await result.json();
  res.status(200).json({
    repos,
    last,
  });
}
