import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CommonMeta from "../../../components/CommonMeta";
import { css } from "@emotion/react";

const Connect: NextPage = () => {
  const { query, replace, asPath } = useRouter();

  useEffect(() => {
    replace(`/discord/getid?key=${query.key}`);
  }, [replace, asPath, query]);

  return (
    <>
      <CommonMeta
        title="ワルトボタンと接続する"
        description="※このリンクは1回のみ有効"
        cardType="summary"
      />

      <div
        css={css`
          max-width: 100vw;
          max-height: 100vh;
          padding: 0 3vw;
          background: #182026;
          color: #ffffff;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 100vh;
          `}
        >
          <p>接続中</p>
        </div>
      </div>
    </>
  );
};

export default Connect;
