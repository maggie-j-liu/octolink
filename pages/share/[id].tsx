import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useState } from "react";
import NotSignedIn from "../../components/NotSignedIn";
import prisma from "../../lib/prisma";

const LinkPage = ({ repoName, id }: { repoName: string; id: string }) => {
  const SEO = () => (
    <NextSeo
      title={`Invitation to ${repoName}`}
      description={`You have been invited to ${repoName}. Accept the invite to be added as a collaborator to this repository.`}
      openGraph={{
        url: `${process.env.NEXT_PUBLIC_URL}/share/${id}`,
      }}
    />
  );
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
    window.location.href = `https://github.com/${repoName}`;
    setLoading(false);
  };
  if (status === "unauthenticated") {
    return (
      <>
        <SEO />
        <NotSignedIn />
      </>
    );
  }
  return (
    <>
      <SEO />
      <main className="px-8 py-16 min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl">
          You have been invited to{" "}
          <a
            href={`https://github.com/${repoName}`}
            className="hover:underline text-primary-600 font-bold"
          >
            {repoName}
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
    </>
  );
};
export default LinkPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
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
      repoName: true,
    },
  });
  if (!link) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      repoName: link.repoName,
      session,
      id: params.id as string,
    },
  };
};
