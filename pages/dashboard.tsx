import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NotSignedIn from "../components/NotSignedIn";
import { useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ShareLink from "../components/ShareLink";

interface Repo {
  id: number;
  full_name: string;
}
export interface Link {
  repo: string;
  id: string;
  _count: {
    uses: number;
  };
}
interface RepoLinks {
  [key: string]: Link[];
}
const Dashboard = () => {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [links, setLinks] = useState<RepoLinks>({});
  const createLink = async (repo: string) => {
    const created = await fetch("/api/links/add", {
      method: "POST",
      body: JSON.stringify({
        repo,
      }),
    }).then((res) => res.json());
    const prev = JSON.parse(JSON.stringify(links));
    if (prev[repo]) {
      prev[repo].push(created);
    } else {
      prev[repo] = [created];
    }
    setLinks(prev);
  };
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const [repos, links]: [{ repos: Repo[]; last: number }, Link[]] =
          await Promise.all([
            fetch("/api/github/get-repos", {
              method: "POST",
              body: JSON.stringify({
                page,
              }),
            }).then((res) => res.json()),
            fetch("/api/links/get", {
              method: "POST",
            }).then((res) => res.json()),
          ]);
        setRepos(repos.repos);
        setLastPage(repos.last);
        const linkMap: RepoLinks = {};
        for (const link of links) {
          if (linkMap[link.repo]) {
            linkMap[link.repo].push(link);
          } else {
            linkMap[link.repo] = [link];
          }
        }
        setLinks(linkMap);
        setLoading(false);
      })();
    }
  }, [status, page]);
  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return <NotSignedIn />;
  }
  return (
    <main className="px-8 py-16">
      <h1 className="text-center text-4xl font-semibold">Dashboard</h1>
      <section className="max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-medium">Your GitHub Repositories</h2>
        <div className="my-8">
          {loading && (
            <div className="space-y-8 py-8">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton className="w-full h-12" key={i} />
              ))}
            </div>
          )}
          {!loading && (
            <div className="divide-y-2 border-y-2">
              {repos.map((repo) => (
                <div key={repo.id} className="py-8 text-lg">
                  <h2>{repo.full_name}</h2>
                  {links[repo.full_name] && (
                    <div className="my-3">
                      <h3 className="text-xl">Share Links</h3>
                      <ul className="space-y-4">
                        {links[repo.full_name].map((link) => (
                          <ShareLink link={link} />
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    className="btn"
                    onClick={() => createLink(repo.full_name)}
                  >
                    Create Link
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-4">
          <button
            className="btn"
            disabled={page === 1}
            onClick={() => {
              setLoading(true);
              setPage((p) => {
                if (p === 1) {
                  return 1;
                }
                return p - 1;
              });
            }}
          >
            previous
          </button>
          <span>{page}</span>
          <button
            className="btn"
            disabled={page === lastPage}
            onClick={() => {
              setLoading(true);
              setPage((p) => {
                if (p === lastPage) {
                  return lastPage;
                }
                return p + 1;
              });
            }}
          >
            next
          </button>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
