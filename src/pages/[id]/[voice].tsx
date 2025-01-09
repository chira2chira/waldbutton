import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ParsedUrlQuery } from "node:querystring";
import CommonMeta from "../../components/CommonMeta";
import { loadAllVoice } from "../../utils/yamlUtil";

const Voice: NextPage = (props) => {
  const { query, push, asPath } = useRouter();
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    if (pushed) return;

    push(
      `/?voice=${encodeURI((query.voice || "").toString())}&id=${query.id}`,
      asPath
    );
    setPushed(true);
  }, [query.id, query.voice, push, asPath, pushed]);

  return (
    <>
      <CommonMeta
        title={`${query.voice} - ワルトボタン`}
        cardType="player"
        playerUrl={`https://waldbutton.vercel.app/player?voice=${query.voice}&id=${query.id}`}
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
