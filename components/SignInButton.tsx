import { signIn } from "next-auth/react";
import { ReactNode } from "react";
const SignInButton = ({
  className = "",
  children = "Sign In",
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <button className={className} onClick={() => signIn("github")}>
      {children}
    </button>
  );
};
export default SignInButton;
