import { Icon, IconName, MaybeElement } from "@blueprintjs/core";
import { css, keyframes } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useRef, useState } from "react";
import { VoiceInfo } from ".";
import CommonMeta from "../components/CommonMeta";
import Loading from "../components/Loading";
import { VolumeContext } from "../providers/VolumeProvider";
import { sendEvent } from "../utils/gtag";
import { loadAllVoice } from "../utils/yamlUtil";

type PlayerProps = {
  voiceInfo: VoiceInfo[];
};

type Status = "pause" | "play" | "buffer" | "error";

function getStatusIcon(status: Status): IconName | MaybeElement {
  switch (status) {
    case "pause":
      return "play";
    case "play":
      return "stop";
    case "buffer":
      return <Loading />;
    case "error":
      return "error";
  }
}

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }`;

const Ranking: NextPage<PlayerProps> = (props) => {
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>("pause");
  const { query } = useRouter();
  const { volume } = useContext(VolumeContext);

  const targetVoice = props.voiceInfo.find(
    (x) => x.text === query.voice && x.id === query.id
  );

  const handleAudioPlay = () => {
    const current = audio.current;
    if (!current) return;

    if (current.duration === undefined) {
      current.load();
    }
    current.volume = volume / 100;

    if (current.paused) {
      current.play();
    } else {
      current.pause();
      current.currentTime = 0;
      handleEnded();
    }
  };

  const handlePlaying = () => {
    const current = audio.current;
    if (!current) return;

    setStatus("play");
    sendEvent({
      action: "play-in-twitter",
      category: "audio",
      label: targetVoice ? targetVoice.text + "@" + targetVoice.id : "",
    });
  };

  const handleEnded = () => {
    setStatus("pause");
  };

  return (
    <>
      <CommonMeta
        title="音声プレイヤー - ワルトボタン"
        cardType="summary_large_image"
      />

      <div
        css={css`
          max-width: 100vw;
          max-height: 100vh;
          padding: 0 3vw;
          background: #182026;
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
          {targetVoice === undefined ? (
            <span
              css={css`
                animation: ${fadeIn} 2s ease-in;
              `}
            >
              存在しないか削除されたボイスです
            </span>
          ) : (
            <>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  margin-bottom: 15px;
                  padding: 8px;
                  border: 1px solid #5c7080;
                  color: white;
                  font-size: clamp(150%, 3vw, 180%);
                  gap: 15px;
                  cursor: pointer;
                `}
                onClick={handleAudioPlay}
              >
                <button
                  css={css`
                    margin: 0;
                    padding: 0;
                    width: clamp(40px, 10vw, 60px);
                    height: clamp(40px, 10vw, 60px);
                    border: none;
                    background: #394b59;
                    flex-shrink: 0;
                    cursor: pointer;
                  `}
                >
                  <Icon icon={getStatusIcon(status)} size={30} color="white" />
                </button>
                <div>
                  <span>{targetVoice.text}</span>
                </div>
                <audio
                  ref={audio}
                  src={targetVoice.url}
                  autoPlay={!!query.auto_play}
                  onPlaying={handlePlaying}
                  onEnded={handleEnded}
                />
              </div>
              <div
                css={css`
                  align-self: flex-end;
                `}
              >
                <a
                  href={`https://waldbutton.vercel.app/${
                    targetVoice.id
                  }/${encodeURI(targetVoice.text)}`}
                  target="_blank"
                  rel="noreferrer"
                  css={css`
                    display: flex;
                    gap: 5px;
                    text-decoration: underline;
                    color: #5c7080;
                  `}
                >
                  <span>ワルトボタンを開く</span>
                  <Icon icon="share" />
                </a>
              </div>
            </>
          )}
        </div>

        <div
          css={css`
            position: absolute;
            right: 0;
            bottom: 0;
            height: 50vh;
            width: 60vw;
            background-image: url("/static/svg/button.svg");
            background-repeat: no-repeat;
            background-position: right 15px bottom;
            opacity: 0.2;
          `}
        />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<PlayerProps> = async (context) => {
  const voiceInfo = loadAllVoice();

  return {
    props: {
      voiceInfo,
    },
  };
};

export default Ranking;
