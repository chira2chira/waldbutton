import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { FocusStyleManager } from "@blueprintjs/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import VolumeProvider from "../providers/VolumeProvider";
import FavoriteProvider from "../providers/FavoriteProvider";
import ConnectProvider from "../providers/ConnectProvider";
import ErrorBoundary from "../components/ErrorBoundary";
import GoogleAnalytics from "../components/GoogleAnalytics";
import useDarkMode from "../hooks/useDarkMode";

FocusStyleManager.onlyShowFocusOnTabs();

dayjs.extend(utc);
dayjs.extend(timezone);

function MyApp({ Component, pageProps }: AppProps) {
  useDarkMode();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <ErrorBoundary>
        <script
          // レンダリング前にダークモード用のクラスをセットする
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener("DOMContentLoaded", () => {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
              document.body.className = "bp5-dark";
              } else {
                document.body.className = "bp5-body";
            }
            });`,
          }}
        />
        <GoogleAnalytics />
        <VolumeProvider>
          <FavoriteProvider>
            <ConnectProvider>
              <Component {...pageProps} />
            </ConnectProvider>
          </FavoriteProvider>
        </VolumeProvider>
      </ErrorBoundary>
    </>
  );
}
export default MyApp;
