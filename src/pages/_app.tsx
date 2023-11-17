import "normalize.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FocusStyleManager } from "@blueprintjs/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import VolumeProvider from "../providers/VolumeProvider";
import FavoriteProvider from "../providers/FavoriteProvider";
import GoogleAnalytics from "../components/GoogleAnalytics";
import usePageView from "../hooks/usePageView";
import useDarkMode from "../hooks/useDarkMode";
import { useRouter } from "next/router";

FocusStyleManager.onlyShowFocusOnTabs();

dayjs.extend(utc);
dayjs.extend(timezone);

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();
  usePageView(asPath);
  useDarkMode();

  return (
    <>
      <script
        // レンダリング前にダークモード用のクラスをセットする
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener("DOMContentLoaded", () => {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
              document.body.className = "bp4-dark";
            } else {
              document.body.className = "bp4-body";
            }
          });`,
        }}
      />
      <GoogleAnalytics />
      <VolumeProvider>
        <FavoriteProvider>
          <Component {...pageProps} />
        </FavoriteProvider>
      </VolumeProvider>
    </>
  );
}
export default MyApp;
