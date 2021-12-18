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
    <div className="py-8 text-lg">
      <h2>{repo.full_name}</h2>
      {links[repo.id] && (
        <div className="my-3">
          <h3 className="text-xl">Share Links</h3>
          <ul className="space-y-4">
            {links[repo.id].map((link) => (
              <ShareLink key={link.id} link={link} />
            ))}
          </ul>
        </div>
      )}
      <button
        className="btn"
        onClick={() => createLink(repo.full_name, repo.id)}
      >
        Create Link
      </button>
    </div>
  );
};
export default Repo;
