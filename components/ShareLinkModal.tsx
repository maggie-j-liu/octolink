import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { Link as LinkType } from "../pages/dashboard";
import Image from "next/image";
import { HiCheck, HiOutlineClipboardCopy, HiX } from "react-icons/hi";
import CopyButton from "./CopyButton";
import { ModalContext } from "./ShareLink";

interface Use {
  user: {
    githubUsername: string;
  };
}

const ShareLinkModal = ({ link }: { link: LinkType }) => {
  const [uses, setUses] = useState<Use[] | null>(null);
  const { modalOpen, setModalOpen } = useContext(ModalContext);

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

  useEffect(() => {
    if (modalOpen && !uses) {
      getUses();
    }
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <>
      <Transition appear show={modalOpen} as={Fragment}>
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
              <div className="relative inline-block w-full max-w-3xl py-8 px-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg border-2 border-gray-300">
                <Dialog.Title
                  as="h3"
                  className="sm:text-xl font-semibold break-all"
                >
                  {link.id}
                </Dialog.Title>
                <div>
                  <CopyButton
                    text={`${process.env.NEXT_PUBLIC_URL}/share/${link.id}`}
                  >
                    <CopyButton.NotCopied className="hover:bg-primary-50 px-2 -mx-2 py-1 rounded-md">
                      <div className="flex items-center gap-2">
                        Copy Link{" "}
                        <HiOutlineClipboardCopy className="w-5 h-5 text-gray-600" />
                      </div>
                    </CopyButton.NotCopied>
                    <CopyButton.Copied>
                      <div className="flex items-center gap-2 py-1">
                        Copied <HiCheck className="w-5 h-5 text-green-600" />
                      </div>
                    </CopyButton.Copied>
                  </CopyButton>
                  <div className="mt-4">
                    {uses === null ? null : uses.length === 0 ? (
                      <>No one has used this link yet!</>
                    ) : (
                      <>
                        <h4 className="text-lg font-semibold">
                          Used by
                          <span className="font-normal text-base bg-gray-200 rounded-full px-2 py-0.5 ml-2">
                            {uses.length}
                          </span>
                        </h4>
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
                                <div className="group-hover:underline text-primary-600 font-medium">
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
                  <HiX className="w-4 h-4" />
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
