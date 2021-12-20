import Link from "next/link";
import { Link as LinkType } from "../pages/dashboard";
import ShareLinkModal from "./ShareLinkModal";
const ShareLink = ({ link }: { link: LinkType }) => {
  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
      <Link href={`/share/${link.id}`}>
        <a className="text-blue-500">
          <span className="hidden md:inline">
            {process.env.NEXT_PUBLIC_URL}/share/
          </span>
          {link.id}
        </a>
      </Link>
      <div className="flex items-center justify-start sm:justify-end w-full gap-4">
        <div>Uses: {link._count.uses}</div>
        <ShareLinkModal link={link} />
      </div>
    </li>
  );
};

export default ShareLink;
