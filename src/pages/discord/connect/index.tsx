import { NextPage } from "next";
import { useRouter } from "next/router";
import useSwr from "swr";
import { useContext, useEffect } from "react";
import { ConnectContext } from "../../../providers/ConnectProvider";
import CommonMeta from "../../../components/CommonMeta";
import { css } from "@emotion/react";
import { dotFlashing } from "./style";

async function postConnect(key: string) {
  try {
    const res = await fetch("/api/discord/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });
    const { success, message } = await res.json();
    return { success: !!success, message };
  } catch (error) {
    return { success: false, message: "通信に失敗しました。" };
  }
}

const Connect: NextPage = () => {
  const { push, query } = useRouter();
  const { connect } = useContext(ConnectContext);
  const { data, error } = useSwr(query.key, postConnect);

  useEffect(() => {
    if (data) {
      if (data.success) connect();
      push(`/?connectMessage=${encodeURI(data.message)}`, "/");
    }
  }, [data, push, connect]);

  if (error)
    return (
      <div>
        致命的なエラーが発生しました。何度も発生する場合は@chira2chiraまでご連絡ください。
        <br />
        {error}
      </div>
    );

  return (
    <>
      <CommonMeta
        title="ワルトボタンと接続する"
        description="※このリンクは5分間有効"
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
          <div
            css={css`
              display: flex;
              gap: 10px;
              align-items: center;
              margin-left: -35px;
              margin-bottom: 20px;
            `}
          >
            <img src="/icon-192x192.png" width={120} alt="ワルトボタン" />
            <div style={{ width: "40px" }}>
              <div css={dotFlashing} />
            </div>
            <img src="/static/svg/discord.svg" height="60" alt="Discord" />
          </div>
          <p>接続中</p>
        </div>
      </div>
    </>
  );
};

export default Connect;
