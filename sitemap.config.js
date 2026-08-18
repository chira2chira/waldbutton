// /[id]/[voice] は「/?voice=...&id=... へリダイレクトするだけのOGP共有用URL」であり、
// ボイス件数(1000件超)ぶんの静的ページが存在する。サイトマップに載せるとクローラが
// 全件を巡回し、ISR Read Units を大量に消費するため除外する。
// SNSのOGPクローラは共有されたURLを直接叩くのでサイトマップの有無は影響しない。
const VOICE_PAGE_PATTERN = /^\/[\w-]{11}\//; // 先頭セグメントがYouTube動画ID(11文字)

module.exports = {
  siteUrl: "https://waldbutton.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/discord/connect", "/player"],
  transform: async (config, path) => {
    if (VOICE_PAGE_PATTERN.test(path)) return null;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
};
