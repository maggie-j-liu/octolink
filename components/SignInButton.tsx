import { signIn } from "next-auth/react";
const SignInButton = () => {
  return <button onClick={() => signIn("github")}>Sign in</button>;
};
export default SignInButton;
