import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Link as LinkType } from "../pages/dashboard";

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
              <Dialog.Overlay className="fixed inset-0" />
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title as="h3" className="">
                  {link.id}
                </Dialog.Title>
                <div className="">
                  <p>
                    link: {process.env.NEXT_PUBLIC_URL}/{link.id}
                  </p>
                  {uses === null && <div>no uses</div>}
                  {uses !== null && (
                    <div>
                      <h4>Used by</h4>
                      {uses.map((use) => (
                        <div key={use.user.githubUsername}>
                          {use.user.githubUsername}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="">
                  <button type="button" className="btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShareLinkModal;
