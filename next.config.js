/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  cacheStartUrl: false,
  runtimeCaching,
  publicExcludes: ["!static/voice/**/*"],
});

const config = {
  // react-beautiful-dnd がStrictMode非対応
  // https://github.com/atlassian/react-beautiful-dnd/issues/2350
  reactStrictMode: false,
};

module.exports = withPWA(config);
