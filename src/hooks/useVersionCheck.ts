import { useEffect } from "react";

const CURRENT_VERSION = "current_version";

export function useVersionCheck() {
  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) return;

    // 起動時のバージョンを保存
    fetchVersion().then((version) => {
      if (version === null) return;

      window.localStorage.setItem(CURRENT_VERSION, version);
    });

    // 10分毎に動かす。初回は動かないため無限ループにはならない
    const id = window.setInterval(() => {
      checkVersion();
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(id);
    };
  }, []);
}

async function fetchVersion() {
  const res = await fetch("/", { method: "HEAD", cache: "no-cache" });
  return res.headers.get("ETag");
}

function checkVersion() {
  console.log("version check start");

  const currentVersion = window.localStorage.getItem(CURRENT_VERSION);
  fetchVersion().then((version) => {
    if (version === null) return;

    window.localStorage.setItem(CURRENT_VERSION, version);

    if (currentVersion && currentVersion !== version) {
      console.log("new version detected");
      window.location.reload();
    } else {
      console.log("already used latest version");
    }
  });
}
