import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import NotSignedIn from "../components/NotSignedIn";
import SignInButton from "../components/SignInButton";

export default function Component() {
  const { data: session, status } = useSession();
  return (
    <main className="h-fu">
      <section className="container px-8 py-16 mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -left-1 sm:-left-1.5 -right-1 sm:-right-1.5 bottom-0.5 sm:bottom-1.5 h-4 sm:h-6 bg-primary-200 rounded-md sm:rounded-lg" />
          <h1 className="relative text-6xl sm:text-8xl font-bold text-center">
            octolink
          </h1>
        </div>
        <h2 className="text-2xl sm:text-3xl text-center font-light">
          Link sharing for GitHub repositories.
        </h2>
        <div className="mt-4">
          {status === "loading" ? (
            <div className="w-24 h-11 cta-btn"></div>
          ) : status === "unauthenticated" ? (
            <>
              <SignInButton className="cta-btn" />
            </>
          ) : (
            <Link href="/dashboard">
              <a className="block cta-btn">Get Started</a>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
