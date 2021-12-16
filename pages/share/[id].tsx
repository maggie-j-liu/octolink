import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import NotSignedIn from "../../components/NotSignedIn";
import prisma from "../../lib/prisma";

const LinkPage = ({ repo, id }: { repo: string; id: string }) => {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const sendInvite = async () => {
    setLoading(true);
    const res = await fetch("/api/github/send-invite", {
      method: "POST",
      body: JSON.stringify({
        id,
      }),
    });
    if (res.status >= 300) {
      const { error } = await res.json();
      alert("Error: " + error);
      setLoading(false);
      return;
    }
    window.location.href = `https://github.com/${repo}`;
    setLoading(false);
  };
  if (status === "unauthenticated") {
    return <NotSignedIn />;
  }
  return (
    <main className="px-8 py-16 min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">
        You have been invited to{" "}
        <a
          href={`https://github.com/${repo}`}
          className="hover:underline text-blue-600 font-bold"
        >
          {repo}
        </a>
      </h1>
      <button
        className="text-lg btn"
        disabled={loading}
        onClick={() => sendInvite()}
      >
        {loading ? "Accepting..." : "Accept Invite"}
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
