import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <link rel="icon" href="/favicon.png" />
          <script
            async
            defer
            data-website-id="05c056bf-42c9-4662-a291-ae551eec977c"
            src="https://umami.maggieliu.dev/umami.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
