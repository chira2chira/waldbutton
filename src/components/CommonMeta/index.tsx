import Head from "next/head";
import React, { useEffect } from "react";
import { isProd } from "../../utils/env";

type CommonMetaProps = {
  title: string;
  description?: string;
  cardType: "summary" | "summary_large_image" | "player";
  playerUrl?: string;
  useTwitterWidget?: boolean;
};

function getCardImage(type: CommonMetaProps["cardType"]) {
  switch (type) {
    case "summary":
    case "player":
      return "https://waldbutton.vercel.app/voice-ogp.png";
    case "summary_large_image":
      return "https://waldbutton.vercel.app/ogp.png";
  }
}

const CommonMeta: React.VFC<CommonMetaProps> = (props) => {
  useEffect(() => {
    let elm: HTMLScriptElement;

    if (props.useTwitterWidget) {
      elm = document.createElement("script");
      elm.setAttribute("src", "https://platform.twitter.com/widgets.js");
      elm.setAttribute("async", "true");
      document.head.appendChild(elm);
    }

    return () => {
      if (elm) document.head.removeChild(elm);
    };
  }, [props.useTwitterWidget]);

  return (
    <>
      <Head>
        {/* タイトルタグに複数要素を入れてはいけない */}
        <title>{`${isProd ? "" : "[DEV]"}${props.title}`}</title>
        <meta
          name="description"
          content={
            props.description ||
            "ワルトボタンはVTuber逢魔牙ワルトの音声ボタンです。ワルトくんの様々なボイスを好きなだけ聞けます。"
          }
        />
        <meta
          name="keywords"
          content="逢魔牙ワルト,おうまがワルト,Oumaga,Wald,ボイス,ボタン"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:url" content="https://waldbutton.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content="逢魔牙ワルトの音声ボタン" />
        <meta property="og:image" content={getCardImage(props.cardType)} />
        <meta name="twitter:card" content={props.cardType} />
        {props.cardType === "player" && (
          <>
            <meta name="twitter:player" content={props.playerUrl} />
            <meta name="twitter:player:width" content="640" />
            <meta name="twitter:player:height" content="360" />
          </>
        )}
      </Head>
    </>
  );
};

export default CommonMeta;
