import { Classes, Dialog } from "@blueprintjs/core";
import { css } from "@emotion/react";
import React, { useState } from "react";
import { sendEvent } from "../../utils/gtag";

const INVITE_LINK = process.env.NEXT_PUBLIC_DISCORD_BOT_URL;

const InviteBot: React.VFC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenLink = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleLinkClick = () => {
    sendEvent({
      action: "invite",
      category: "discord",
      label: "discord",
    });
  };

  return (
    <div>
      <a
        css={css`
          display: flex;
          justify-content: center;
          gap: 3px;
        `}
        onClick={handleOpenLink}
      >
        <img src="/static/svg/discord.svg" height="17" alt="Discordアイコン" />
        <span>Discord bot</span>
      </a>

      <Dialog isOpen={modalOpen} onClose={handleClose} title="ワルトボタンbot">
        <div className={Classes.DIALOG_BODY}>
          <p>
            ワルトボタンbotをDiscordサーバーに招待すると、ボイスチャットにワルトボタンの音声を流すことができます。
          </p>
          <div
            css={css`
              text-align: center;
            `}
          >
            <a
              css={css`
                margin: 10px 0 20px;
                padding: 13px 15px;
                display: inline-block;
                font-size: 120%;
                border-radius: 3px;
                background-color: rgb(89, 100, 242);

                &:link,
                &:visited,
                &:hover {
                  color: #ffffff !important;
                }
              `}
              href={INVITE_LINK}
              onClick={handleLinkClick}
              target="_blank"
              rel="noreferrer"
            >
              ワルトボタンbotをDiscordに招待する
            </a>
          </div>
          <p className="bp6-running-text">
            <code>/search キーワード</code>
            <span> をチャットするとボタンを検索することができます。</span>
            <br />
            <span>検索結果からボタンを選択するとボイスチャンネルから音声が流れます（ボイスチャンネルに参加している状態で選択しないと流れません）</span>
          </p>
          <img
            style={{ width: "80%", margin: "0 auto 10px", display: "block" }}
            src="/static/image/discord-play.png"
            alt="ワルトボタンbotの/searchコマンドの使用例"
            loading="lazy"
          />
          <p className="bp6-running-text">
            <code>/connect</code>
            <span> をチャットするとブラウザで再生したワルトボタンをそのままVCで流すことができます。</span>
          </p>
          <img
            style={{ width: "80%", margin: "0 auto 5px", display: "block" }}
            src="/static/image/discord-connect.png"
            alt="ワルトボタンbotの/connectコマンドの使用例"
            loading="lazy"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default InviteBot;
