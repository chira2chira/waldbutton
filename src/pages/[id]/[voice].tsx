import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ParsedUrlQuery } from "node:querystring";
import CommonMeta from "../../components/CommonMeta";
import { loadAllVoice } from "../../utils/yamlUtil";

const Voice: NextPage = () => {
  const [pushed, setPushed] = useState(false);
  const { query, push, asPath } = useRouter();
  const encodedVoice = encodeURIComponent((query.voice || "").toString());

  useEffect(() => {
    if (pushed) return;

    push(`/?voice=${encodedVoice}&id=${query.id}`);
    setPushed(true);
  }, [query.id, encodedVoice, push, asPath, pushed]);

  return (
    <>
      <CommonMeta
        title={`${query.voice} - ワルトボタン`}
        cardType="player"
        playerUrl={`https://waldbutton.vercel.app/player?voice=${encodedVoice}&id=${query.id}`}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};

interface Params extends ParsedUrlQuery {
  id: string;
  voice: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async (context) => {
  const voiceInfo = loadAllVoice();
  const uniqueIds = Array.from(new Set(voiceInfo.map((x) => x.id)));

  let paths: Array<{ params: Params }> = [];
  uniqueIds.forEach((id) => {
    // id が null の場合がある
    if (!!id) {
      paths = paths.concat(
        voiceInfo
          .filter((x) => x.id === id)
          .map((vInfo) => ({
            params: {
              id,
              voice: vInfo.text,
            },
          }))
      );
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export default Voice;
