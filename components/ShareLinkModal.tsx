import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link as LinkType } from "../pages/dashboard";
import Image from "next/image";
import { FiCheck, FiCopy, FiX } from "react-icons/fi";
import CopyButton from "./CopyButton";

interface Use {
  user: {
    githubUsername: string;
  };
}

const ShareLinkModal = ({ link }: { link: LinkType }) => {
  const [uses, setUses] = useState<Use[] | null>(null);
  const getUses = async () => {
    const res = await fetch("/api/links/get-uses", {
      method: "POST",
      body: JSON.stringify({
        id: link.id,
      }),
    });
    const data = await res.json();
    setUses(data.uses);
  };
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    if (!uses) {
      getUses();
    }
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="">
        <button type="button" onClick={openModal} className="btn">
          View Details
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900/70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative inline-block w-full max-w-3xl py-8 px-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="sm:text-xl font-bold">
                  {link.id}
                </Dialog.Title>
                <div>
                  <CopyButton
                    text={`${process.env.NEXT_PUBLIC_URL}/share/${link.id}`}
                  >
                    <CopyButton.NotCopied>
                      <div className="flex items-center gap-2">
                        Copy Link <FiCopy className="w-4 h-4 text-gray-600" />
                      </div>
                    </CopyButton.NotCopied>
                    <CopyButton.Copied>
                      <div className="flex items-center gap-2">
                        Copied <FiCheck className="w-4 h-4 text-green-600" />
                      </div>
                    </CopyButton.Copied>
                  </CopyButton>
                  <div className="mt-4">
                    {uses === null && <>no uses</>}
                    {uses !== null && (
                      <>
                        <h4 className="text-lg font-semibold">Used by</h4>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 mt-2">
                          {uses.map((use) => (
                            <a
                              href={`https://github.com/${use.user.githubUsername}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-max group"
                              key={use.user.githubUsername}
                            >
                              <div className="flex items-center gap-3 text-lg w-max">
                                <div className="rounded-full overflow-hidden w-8 h-8">
                                  <Image
                                    width={32}
                                    height={32}
                                    src={`https://github.com/${use.user.githubUsername}.png`}
                                  />
                                </div>
                                <div className="group-hover:underline text-blue-600 font-medium">
                                  {use.user.githubUsername}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute top-4 right-4"
                  onClick={closeModal}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShareLinkModal;
