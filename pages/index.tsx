import { useSession, signIn, signOut } from "next-auth/react";
import NotSignedIn from "../components/NotSignedIn";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return <NotSignedIn />;
}
