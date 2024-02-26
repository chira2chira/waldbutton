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
        Discord bot
      </a>

      <Dialog isOpen={modalOpen} onClose={handleClose} title="ワルトボタンbot">
        <div className={Classes.DIALOG_BODY}>
          <p>
            ワルトボタンbotをDiscordサーバーに招待すると、ボイスチャットにワルトボタンの音声を流すことができます。
          </p>
          <p className="bp4-running-text">
            botを招待し、<code>/search キーワード</code>{" "}
            をチャットすることでボタンを検索することができます。
            <br />
            検索結果からボタンを選択するとボイスチャンネルから音声が流れます（ボイスチャンネルに参加している状態で選択しないと流れません）
          </p>
          <img
            style={{ width: "100%" }}
            src="/static/image/discord-play.png"
            alt="ワルトボタンbot"
            loading="lazy"
          />
          <div
            css={css`
              text-align: center;
            `}
          >
            <a
              css={css`
                margin: 20px 0 0;
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
        </div>
      </Dialog>
    </div>
  );
};

export default InviteBot;
