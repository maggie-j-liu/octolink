import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import SignInButton from "./SignInButton";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <nav className="h-16 absolute top-0 px-8 w-full">
      <div className="sm:text-lg h-full max-w-4xl mx-auto w-full flex items-center justify-between">
        <div className="font-bold">
          <Link href="/">
            <a>Octolink</a>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-6 sm:gap-10">
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
          {status === "authenticated" ? (
            <>
              <Menu as="div" className="relative w-9 h-9">
                <Menu.Button className="w-full h-full">
                  <Image
                    width={36}
                    height={36}
                    src={`https://github.com/${
                      session?.githubUsername as string
                    }.png`}
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Menu.Items className="text-base border border-gray-300 absolute right-0 w-max p-1 origin-top bg-white rounded-lg shadow-lg">
                    <Menu.Item as="div" className="px-4 py-1.5" disabled>
                      {session?.githubUsername as string}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`font-medium rounded-md px-4 py-1.5 text-left w-full ${
                            active ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            signOut();
                            router.push("/");
                          }}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
