import Link from "next/link";
import { Link as LinkType } from "../pages/dashboard";
const ShareLink = ({ link }: { link: LinkType }) => {
  const getUses = async () => {
    const res = await fetch("/api/links/get", {
      method: "POST",
      body: JSON.stringify({
        id: link.id,
      }),
    });
    console.log(await res.json());
  };
  return (
    <li className="flex items-center justify-between gap-4">
      <Link href={`/share/${link.id}`}>
        <a className="text-blue-500">
          {process.env.NEXT_PUBLIC_URL}/share/{link.id}
        </a>
      </Link>
      <div>Uses: {link._count.uses}</div>
    </li>
  );
};

export default ShareLink;
