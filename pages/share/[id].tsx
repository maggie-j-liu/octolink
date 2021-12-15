import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import NotSignedIn from "../../components/NotSignedIn";
import prisma from "../../lib/prisma";

const LinkPage = ({ repo, id }: { repo: string; id: string }) => {
  const { data: session, status } = useSession();
  const [invite, setInvite] = useState("not sent");
  const sendInvite = async () => {
    setInvite("sending");
    await fetch("/api/github/send-invite", {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    });
    setInvite("sent");
  };
  if (status === "unauthenticated") {
    return <NotSignedIn />;
  }
  return (
    <main className="px-8 py-16 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl">
        You have been invited to{" "}
        <a
          href={`https://github.com/${repo}`}
          className="hover:underline text-blue-600 font-bold"
        >
          {repo}
        </a>
      </h1>
      <p>
        If you accept this invitation, you'll receive an invitation on GitHub,
        which you can accept{" "}
        <a
          href={`https://github.com/${repo}/invitations`}
          className="hover:underline text-blue-600 font-bold"
        >
          here
        </a>
      </p>
      <button
        className="btn"
        disabled={invite === "sending" || invite === "sent"}
        onClick={() => sendInvite()}
      >
        {invite === "not sent"
          ? "Send Invite"
          : invite === "sending"
          ? "Sending"
          : "Sent!"}
      </button>
    </main>
  );
};
export default LinkPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      props: {
        session,
      },
    };
  }
  if (!params || !params.id) {
    return {
      notFound: true,
    };
  }
  const link = await prisma.link.findUnique({
    where: {
      id: params.id as string,
    },
    select: {
      repo: true,
    },
  });
  if (!link) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      repo: link.repo,
      session,
      id: params.id as string,
    },
  };
};
