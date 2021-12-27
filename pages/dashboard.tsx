import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NotSignedIn from "../components/NotSignedIn";
import { useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Repo from "../components/Repo";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

export interface RepoType {
  id: number;
  full_name: string;
}
export interface Link {
  repoId: number;
  id: string;
  _count: {
    uses: number;
  };
}
export interface RepoLinks {
  [key: string]: Link[];
}

const SEO = () => (
  <NextSeo
    title="Dashboard"
    description="Create and manage links to invite others to collaborate on your repositories."
    openGraph={{
      url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
    }}
  />
);
const Dashboard = ({ page: initialPage }: { page: number }) => {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<RepoType[]>([]);
  const [page, setPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(1);
  const [links, setLinks] = useState<RepoLinks>({});
  const router = useRouter();
  const createLink = async (repoName: string, repoId: number) => {
    const created = await fetch("/api/links/add", {
      method: "POST",
      body: JSON.stringify({
        repoName,
        repoId,
      }),
    }).then((res) => res.json());
    const prev: typeof links = JSON.parse(JSON.stringify(links));
    if (prev[repoId]) {
      prev[repoId] = [created, ...prev[repoId]];
    } else {
      prev[repoId] = [created];
    }
    setLinks(prev);
  };
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const repos: { repos: RepoType[]; last: number } = await fetch(
          "/api/github/get-repos",
          {
            method: "POST",
            body: JSON.stringify({
              page,
            }),
          }
        ).then((res) => res.json());
        if (!repos.repos.length && page !== 1) {
          setPage(1);
          router.replace(`/dashboard`);
          return;
        }
        setRepos(repos.repos);
        setLastPage(repos.last);
        const needToGet: number[] = [];
        for (const repo of repos.repos) {
          if (!links[repo.id]) {
            needToGet.push(repo.id);
          }
        }
        if (needToGet.length) {
          const newLinks = await fetch("/api/links/get", {
            method: "POST",
            body: JSON.stringify({
              repoIds: needToGet,
            }),
          }).then((res) => res.json());
          const linkMap: RepoLinks = {};
          for (const link of newLinks) {
            if (linkMap[link.repoId]) {
              linkMap[link.repoId].push(link);
            } else {
              linkMap[link.repoId] = [link];
            }
          }
          // console.log("links", links);
          // console.log("linkmap", linkMap);
          setLinks((prev) => ({ ...prev, ...linkMap }));
        }

        setLoading(false);
      })();
    }
  }, [status, page]);
  if (status === "loading") {
    return <SEO />;
  }
  if (status === "unauthenticated") {
    return (
      <>
        <SEO />
        <NotSignedIn />
      </>
    );
  }
  return (
    <>
      <SEO />
      <main className="px-8 pt-28 pb-16 bg-gray-100 min-h-screen">
        <div className="relative w-max mx-auto">
          <div className="absolute -left-0.5 -right-0.5 bottom-1 h-2 bg-primary-200 rounded-md sm:rounded-lg" />
          <h1 className="relative text-center text-4xl font-semibold">
            Dashboard
          </h1>
        </div>
        <section className="max-w-4xl mx-auto mt-8">
          <h2 className="text-3xl font-medium">Your GitHub Repositories</h2>
          <div className="mb-8">
            {loading && (
              <div className="space-y-8 py-8">
                {[...Array(3)].map((_, i) => (
                  <LoadingSkeleton className="w-full h-12" key={i} />
                ))}
              </div>
            )}
            {!loading && (
              <div className="divide-y-2 divide-dashed divide-gray-300">
                {repos.map((repo) => (
                  <Repo
                    key={repo.id}
                    repo={repo}
                    links={links}
                    createLink={createLink}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-4">
            <button
              className="primary-btn"
              disabled={page === 1}
              onClick={() => {
                setLoading(true);
                if (page !== 1) {
                  setPage(page - 1);
                  router.push("/dashboard?page=" + (page - 1), undefined, {
                    shallow: true,
                  });
                }
              }}
            >
              previous
            </button>
            <span>{page}</span>
            <button
              type="button"
              className="primary-btn"
              disabled={page === lastPage}
              onClick={() => {
                setLoading(true);
                if (page !== lastPage) {
                  setPage(page + 1);
                  router.push("/dashboard?page=" + (page + 1), undefined, {
                    shallow: true,
                  });
                }
              }}
            >
              next
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query?.page) {
    const page = Number(query.page);
    if (!isNaN(page) && page > 0) {
      return { props: { page } };
    }
  }
  return {
    props: {
      page: 1,
    },
  };
};
