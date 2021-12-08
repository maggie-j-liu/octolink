import { useSession } from "next-auth/react";
import { useEffect } from "react";
import NotSignedIn from "../components/NotSignedIn";
import { useState } from "react";
interface Repo {
  id: number;
  full_name: string;
}
const Dashboard = () => {
  const { data: session, status } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        const data = await fetch("/api/github/get-repos", {
          method: "POST",
        }).then((res) => res.json());
        setRepos(data);
      })();
    }
  }, [status]);
  if (status === "loading") {
    return null;
  }
  if (status === "unauthenticated") {
    return <NotSignedIn />;
  }
  return (
    <div>
      {repos.map((repo) => (
        <div key={repo.id}>
          <h2>{repo.full_name}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
