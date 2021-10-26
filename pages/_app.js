import "../styles/globals.css";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>FruitPlace 🍏🍌🥝🍒</title>
        <meta property="og:title" content="FruitPlace" key="title" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
