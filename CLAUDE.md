# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「ワルトボタン」— YouTube配信者のボイスを再生する日本語のファンサイト。Next.js (Pages Router) + TypeScript で構築され、Vercel にデプロイされている。ボイスの実体は `public/static/voice/*.mp3`、メタデータは `assets/voice_*.yaml` が単一の情報源。DB は使わず、YAML をビルド時に読み込んで静的生成する。

## コマンド

```
yarn dev      # 開発サーバー (http://localhost:3000)
yarn build    # 本番ビルド + postbuild で next-sitemap 実行
yarn start    # ビルド済み成果物の起動
yarn lint     # next lint
yarn analyze  # ANALYZE=true でバンドル解析付きビルド
```

テストフレームワークは導入されていない。型チェックは `yarn build` / `yarn lint` に含まれる。

## Windowsでのビルド時の注意

**`yarn build` は Windows では最後まで通らない。** これは既知の環境依存問題であり、コードの不具合ではない。

`src/pages/[id]/[voice].tsx` の `getStaticPaths` はボイス本文 (`assets/voice_*.yaml` の `text`) をそのまま URL セグメントにするため、Next.js は本文をファイル名として `.next/export/` 以下に書き出す。`*` `?` `:` `"` `<` `>` `|` は Windows のファイル名に使えないため、該当するボイスで `ENOENT` になり export が失敗する。

```
Error occurred prerendering page "/Do1RPJRtINA/(*‘ω‘ *)"
Error: ENOENT: no such file or directory, open '...\.next\export\Do1RPJRtINA\(*‘ω‘ *).json'
```

- 現時点で該当するのは `assets/voice_meme.yaml` の2件 (`(*‘ω‘ *)` と `Kirby? Kirby? Wow!! Kirby!!`)。YAML にこれらの文字を含む `text` を追加すると該当が増える。
- Linux (Vercel の本番ビルド) では発生しない。
- Windows で確認できるのは **コンパイル・型チェック・Lint・`Collecting page data` まで**。ここまで通れば実質的な検証としては十分で、それ以降のエラーは無視してよい。
- 全ページのプリレンダリングまで確認したい場合は、`getStaticPaths` の `paths` から不正文字を含むものを一時的に除外してビルドし、確認後に必ず元に戻す。

なお `next-pwa` はビルドのたびに `public/sw.js` と `public/workbox-*.js` を再生成するが、これらは `.gitignore` 済みなので差分は出ない。

## アーキテクチャ

### ボイスデータの流れ

`assets/voice_{greeting,reaction,se,dirty,saying,meme,sensitive,common}.yaml` (1件 = `url` / `text` / `kana` / `id`) を `src/utils/yamlUtil.ts` の `loadAllVoice()` が全ファイル読み込み、カテゴリを付与して1つの配列に結合する。`kana` はここで半角→全角カタカナ + 小文字に正規化され、検索の照合キーになる。`id` は出典の YouTube 動画ID。

サーバーサイド (`getStaticProps` / API Routes) 専用。`fs` を使うためクライアントから呼んではいけない。

### ページ構成 (Pages Router)

- `/` — 全ボイス一覧。`getStaticProps` で `loadAllVoice()` + YouTube Data API の動画情報を取得。カテゴリ表示と動画別表示を切り替える。検索・お気に入り・音量・Discord連携の UI はすべてこのページに集約されている。`filterList()` など検索ロジックもここに定義され、API Routes から import されている。
- `/[id]/[voice]` — SNS共有用の OGP 専用ページ。1000件超が静的生成されるが、中身は `/?voice=...&id=...` へ `location.href` でリダイレクトするだけ。`router.push` は Vercel 上でエラーになるため使わないこと。
- `/ranking` — BigQuery の GA4 エクスポートから直近1週間の再生数上位50件を集計 (`src/utils/bigQuery.ts`)。ISR で更新される。
- `/pokemon/*`, `/game/pairs` — ポケモン名当てクイズと神経衰弱。ボイスは `public/static/voice/pokemon/` のファイル名 (`{id},{名前}.mp3`) と `assets/pokemon_master.json` の突き合わせで構築される (`src/utils/pokemon.ts`)。
- `/player` — Twitter Player Card 用の埋め込みページ。
- `/discord/connect` — Discord Bot との接続コード入力画面。

### ISR Read Units の削減

Vercel の ISR 課金 (8KB = 1 unit) を抑えるための対策が複数箇所に入っている。変更時は理由を確認すること。

- `sitemap.config.js` — `/[id]/[voice]` (先頭セグメントが11文字のYouTube動画ID) をサイトマップから除外。クローラが1000件超を巡回するのを防ぐ。
- `.github/workflows/update-ranking.yml` — 毎日 JST 0:01 に `/api/update-ranking?secret=...` を叩き、`res.revalidate("/ranking")` でオンデマンド再生成する。ページ側に `revalidate` を書かないのはこのため。

### 外部連携

- **Discord Bot** — `/api/discord/connect` で接続コードを Bot (`BOT_ENDPOINT`) に転送し、返ってきたチャンネルIDを `iron-session` の暗号化Cookieに保存。`/api/discord/play` はそのセッションを使って Bot に再生を依頼する。Bot 本体は別リポジトリ。
- **BigQuery** — サービスアカウント鍵は `BIGQUERY_PRIVATE_KEY` (改行を含むため `.env` の `NL=\n` と組み合わせる) から `src/utils/bigQuery.ts` が一時ファイルを組み立て、クエリ後に削除する。
- **YouTube Data API** — `src/utils/youtube.ts`。50件ずつしか取れないため分割リクエストしている。
- **GA4** — `src/utils/gtag.ts`。`sendEvent` の `label` は `"{text}@{id}"` 形式で送られ、ランキング集計はこの形式に依存している。

### Vercel 固有の回避策

- `src/pages/api/dummy.ts` — Yarn 利用時に Vercel が YAML の依存を静的解析できずデプロイ後に見つからなくなる。全 YAML を `fs.readFileSync` するだけのダミーモジュールを置いて同梱させている。削除するとランタイムエラーになる。
- `src/pages/ranking.tsx` の `getStaticProps` 内の `path.join(process.cwd(), "assets")` も同じ理由。

### UI

- **@blueprintjs/core v6** — UIコンポーネント。ダークモードは `_app.tsx` のインラインスクリプトで `body` に `bp6-dark` / `bp6-body` を付け替える。
- **@emotion/react** — `css` prop でスタイリング (`tsconfig.json` の `jsxImportSource` 設定済み)。
- **Provider** — `VolumeProvider` / `FavoriteProvider` / `ConnectProvider` が `_app.tsx` でネストされ、音量・お気に入り・Discord接続状態を localStorage 経由で保持する。
- `react-beautiful-dnd` が StrictMode 非対応のため `next.config.js` で `reactStrictMode: false`。

## 依存関係の注意

- `package.json` の `resolutions` で `postcss` と `serialize-javascript` を上書きしている。前者は next が完全固定、後者は next-pwa → workbox 経由で古いバージョンが入るため、脆弱性対応として必要。`yarn upgrade` だけでは解消しない。
- `next-pwa@5.6.0` と `react-beautiful-dnd@13.1.1` はメンテナンス停止済み。React 19 / Next 15 との peer dependency 警告が常時出るが動作はする。
- Next.js 15 で Google Fonts CSS の自動インライン化 (`optimizeFonts`) は廃止された。`_document.tsx` の Yusei Magic は通常の外部CSS として読み込まれる。
