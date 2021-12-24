import Link from "next/link";
import { createContext, SetStateAction, useState, Dispatch } from "react";
import {
  HiOutlineClipboardCopy,
  HiOutlineCheck,
  HiChevronDoubleRight,
} from "react-icons/hi";
import { Link as LinkType } from "../pages/dashboard";
import CopyButton from "./CopyButton";
import ShareLinkModal from "./ShareLinkModal";

export const ModalContext = createContext<{
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}>({
  modalOpen: false,
  setModalOpen: () => {},
});
const ShareLink = ({ link }: { link: LinkType }) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <li className="hover:bg-gray-50 relative w-full px-6 py-6 sm:py-4">
      <div className="relative flex items-center justify-between gap-2">
        <div className="min-w-0 flex flex-col gap-2">
          <div className="min-w-0 flex items-center gap-0.5 sm:gap-2">
            <Link href={`/share/${link.id}`}>
              <a className="order-2 sm:order-1 text-primary-600 font-medium truncate min-w-0">
                <span className="hidden md:inline">
                  {process.env.NEXT_PUBLIC_URL}/share/
                </span>
                {link.id}
              </a>
            </Link>
            <div className="flex flex-shrink-0 order-1 sm:order-2">
              <CopyButton
                text={`${process.env.NEXT_PUBLIC_URL}/share/${link.id}`}
              >
                <CopyButton.Copied>
                  <HiOutlineCheck className="w-5 h-5 text-green-600" />
                </CopyButton.Copied>
                <CopyButton.NotCopied className="z-10">
                  <HiOutlineClipboardCopy className="w-5 h-5 text-gray-600" />
                </CopyButton.NotCopied>
              </CopyButton>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <div>
              {link._count.uses} {link._count.uses === 1 ? "use" : "uses"}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <HiChevronDoubleRight className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <button
        className="absolute inset-0 w-full h-full"
        onClick={() => {
          setModalOpen(true);
        }}
      />
      <ModalContext.Provider value={{ modalOpen, setModalOpen }}>
        <ShareLinkModal link={link} />
      </ModalContext.Provider>
    </li>
  );
};

export default ShareLink;
