import Link from "next/link";
import { Link as LinkType } from "../pages/dashboard";
import ShareLinkModal from "./ShareLinkModal";
const ShareLink = ({ link }: { link: LinkType }) => {
  return (
    <li className="flex items-center justify-between gap-4">
      <Link href={`/share/${link.id}`}>
        <a className="text-blue-500">
          {process.env.NEXT_PUBLIC_URL}/share/{link.id}
        </a>
      </Link>
      <div>Uses: {link._count.uses}</div>
      <ShareLinkModal link={link} />
    </li>
  );
};

export default ShareLink;
