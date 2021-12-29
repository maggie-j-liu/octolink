import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <DefaultSeo
        titleTemplate="%s | Octolink"
        defaultTitle="Octolink"
        description="Link sharing for GitHub repositories. Create links to your repositories and share them with others to automatically invite them to your repositories."
        twitter={{
          cardType: "summary_large_image",
        }}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_URL}`,
          images: [
            {
              url: "/og-image.png",
              width: 1200,
              height: 630,
              alt: "Octolink | Link sharing for GitHub repositories",
            },
          ],
        }}
      />
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
