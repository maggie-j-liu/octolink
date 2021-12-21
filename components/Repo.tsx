import { RepoType, RepoLinks } from "../pages/dashboard";
import ShareLink from "./ShareLink";
const Repo = ({
  repo,
  links,
  createLink,
}: {
  repo: RepoType;
  links: RepoLinks;
  createLink: (name: string, id: number) => {};
}) => {
  return (
    <div className="py-8">
      <h2 className="text-lg">{repo.full_name}</h2>
      {links[repo.id] && (
        <div className="my-3">
          <h3 className="text-xl">Share Links</h3>
          <ul className="divide-y bg-white rounded-md shadow overflow-hidden">
            {links[repo.id].map((link) => (
              <ShareLink key={link.id} link={link} />
            ))}
          </ul>
        </div>
      )}
      <button
        className="white-btn"
        onClick={() => createLink(repo.full_name, repo.id)}
      >
        Create Link
      </button>
    </div>
  );
};
export default Repo;
