import { signIn } from "next-auth/react";
const NotSignedIn = () => {
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("github")}>Sign in</button>
    </>
  );
};
export default NotSignedIn;
