/** @type {import('next').NextConfig} */

const { withLogtail } = require("@logtail/next");
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheStartUrl: false,
  runtimeCaching,
  publicExcludes: ["!static/voice/**/*"],
});

const config = {
  // react-beautiful-dnd がStrictMode非対応
  // https://github.com/atlassian/react-beautiful-dnd/issues/2350
  reactStrictMode: false,
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withPWA(withLogtail(config)));
