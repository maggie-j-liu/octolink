import SignInButton from "./SignInButton";

const NotSignedIn = () => {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen gap-4 px-8 py-16">
      <div className="text-center text-2xl sm:text-4xl font-semibold">
        You&apos;re not signed in.
      </div>
      <SignInButton className="cta-btn" />
    </main>
  );
};

export default NotSignedIn;
