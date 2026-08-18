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
  // Yusei Magic(日本語フォント)のCSSは @font-face が122個で約100KBあり、
  // 自動フォント最適化を有効にすると全ページのHTMLにインライン化されて
  // ISR Read Units(8KB=1unit)を大量に消費するため無効化する
  optimizeFonts: false,
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withPWA(withLogtail(config)));
