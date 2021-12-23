import { useSession, signIn, signOut } from "next-auth/react";
import NotSignedIn from "../components/NotSignedIn";

export default function Component() {
  const { data: session, status } = useSession();
  return (
    <main>
      <section className="container mx-auto min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-center">octolink</h1>
        <h2 className="text-2xl text-center font-light">
          Link sharing for GitHub repositories.
        </h2>
      </section>
    </main>
  );
}
