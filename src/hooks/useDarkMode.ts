import { useCallback, useEffect, useState } from "react";

function getOsAppearance() {
  // SSR時は判定しない
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function useDarkMode() {
  const [osAppearance, setOsAppearance] = useState(getOsAppearance());

  const setCurrentAppearance = useCallback(() => {
    if (document.visibilityState === "visible") {
      // Safari PWAだと遅延させないと上手く動かない
      setTimeout(() => {
        setOsAppearance(getOsAppearance());
      }, 100);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", setCurrentAppearance);

    return () => {
      document.removeEventListener("visibilitychange", setCurrentAppearance);
    };
  }, [setCurrentAppearance]);

  useEffect(() => {
    if (osAppearance === "dark") {
      document.body.className = "bp5-dark";
    } else {
      document.body.className = "bp5-body";
    }
  }, [osAppearance]);
}
