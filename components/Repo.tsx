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
      <div className="flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-4">
        <h2 className="text-lg">{repo.full_name}</h2>
        <button
          className="border-primary-500 border-2 px-2 py-1 rounded-lg text-primary-600 hover:text-gray-200 hover:bg-primary-500 "
          onClick={() => createLink(repo.full_name, repo.id)}
        >
          Create Link
        </button>
      </div>
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
    </div>
  );
};
export default Repo;
