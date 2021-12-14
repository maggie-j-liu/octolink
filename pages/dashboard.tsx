import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NotSignedIn from "../components/NotSignedIn";
import { useState } from "react";
import LoadingSkeleton from "../components/LoadingSkeleton";
interface Repo {
  id: number;
  full_name: string;
}
const Dashboard = () => {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const data = await fetch("/api/github/get-repos", {
          method: "POST",
          body: JSON.stringify({
            page,
          }),
        }).then((res) => res.json());
        setRepos(data.repos);
        setLastPage(data.last);
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
