import { useSession, signIn, signOut } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import NotSignedIn from "../components/NotSignedIn";
import SignInButton from "../components/SignInButton";
import step1 from "../public/step1.png";
import step2 from "../public/step2.png";
import step3 from "../public/step3.png";

export default function Component() {
  const { status } = useSession();
  return (
    <>
      <NextSeo
        titleTemplate="%s"
        title="Octolink: Link sharing for GitHub repositories"
      />
      <main>
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
              <div className="cta-btn">Get Started</div>
            ) : status === "unauthenticated" ? (
              <>
                <SignInButton className="cta-btn">Get Started</SignInButton>
              </>
            ) : (
              <Link href="/dashboard">
                <a className="block cta-btn">Get Started</a>
              </Link>
            )}
          </div>
        </section>
        <section className="max-w-5xl w-full mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-2 justify-center items-stretch md:items-center">
            <div className="md:text-right">
              <h2 className="text-2xl font-semibold">Step 1</h2>
              <p>Sign in, then create a link in your dashboard.</p>
            </div>
            <div className="md:w-1/2 flex-shrink-0">
              <Image src={step1} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Step 2</h2>
              <p>
                Send the link to someone you want to invite to your repository.
              </p>
            </div>
            <div className="md:order-first md:w-1/2 flex-shrink-0">
              <Image src={step2} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 justify-between items-stretch md:items-center">
            <div className="md:text-right">
              <h2 className="text-2xl font-semibold">Step 3</h2>
              <p>
                When they click the link and accept the invite, they'll be added
                to the repository!
              </p>
            </div>
            <div className="md:w-1/2 flex-shrink-0">
              <Image src={step3} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
