// pages/_app.js
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/alex-brush/400.css";
import "../styles.css";
import Head from "next/head";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#dff7f6",
      100: "#b1eae8",
      200: "#80dddb",
      300: "#4dcecf",
      400: "#26c3c7",
      500: "#00b9c1",
      600: "#00A9AF",
      700: "#009497",
      800: "#008080",
      900: "#055d57",
    },
  },
  fonts: {
    heading: `'IBM Plex Sans'`,
    body: `'IBM Plex Sans'`,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AP Gov MCQs - Brian, Tej, Saif, Jaideep</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
