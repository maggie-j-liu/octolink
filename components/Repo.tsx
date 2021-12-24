import { HiLink } from "react-icons/hi";
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
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center gap-1 sm:gap-4">
        <h2 className="text-lg">
          <a
            className="hover:text-primary-800 hover:underline font-medium break-all"
            href={`https://github.com/${repo.full_name}`}
          >
            {repo.full_name}
          </a>
        </h2>
        <button
          className="border-primary-500 border-2 px-2 py-1 rounded-lg text-primary-600 hover:text-gray-200 hover:bg-primary-500 duration-200 hover:duration-100"
          onClick={() => createLink(repo.full_name, repo.id)}
        >
          Create Link
        </button>
      </div>
      {links[repo.id] && (
        <div className="my-3">
          <div className="flex items-center gap-1">
            <HiLink className="text-gray-500" />
            <h3 className="text-base">Share Links</h3>
          </div>
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
