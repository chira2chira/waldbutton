import React, { useContext } from "react";
import { Classes, Dialog, Icon } from "@blueprintjs/core";
import { css } from "@emotion/react";
import dayjs from "dayjs";
import { VoiceInfo, YouTubeInfo } from "../../pages";
import { sendEvent } from "../../utils/gtag";
import { FavoriteContext } from "../../providers/FavoriteProvider";
import ButtonBase from "../ButtonBase";

type VideoInfoProps = {
  isOpen: boolean;
  videoInfo?: VoiceInfo & YouTubeInfo;
  hasPrev: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const shareButton = css`
  padding: 2px 8px;
  border-radius: 11px;
  background: #1d9bf0;
  color: white !important;
  flex-shrink: 0;

  &:hover {
    text-decoration: none;
    background: #0c7abf;
    color: white;
  }
`;

const thumbBox = css`
  position: relative;
  margin: -15px -15px 10px -15px;
`;

const thumbImage = css`
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
  background: #bfccd6;
`;

const titleText = css`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2em;
  text-decoration: underline;
`;

const voiceText = css`
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 600;
`;

const timeTag = css`
  margin-right: 7px;
  padding: 1px 4px;
  border-radius: 3px;
  background: #5c7080;
  color: white;
  font-size: 80%;
`;

const controlBox = css`
  position: absolute;
  width: 100%;
  height: 60px;
  top: calc(50% - 30px);
  display: flex;
  justify-content: space-between;
  user-select: none;
`;

const controlButton = css`
  background: rgba(255, 255, 255, 0.7);
  border: none;
  cursor: pointer;
`;

const VideoInfo: React.VFC<VideoInfoProps> = (props) => {
  const { isOpen, videoInfo, hasPrev, hasNext, onPrev, onNext } = props;
  const { addFavorite, removeFavorite, inFavorite } =
    useContext(FavoriteContext);

  let timeParam = "0";
  if (videoInfo?.time) {
    const splitTime = videoInfo.time.split(":");
    if (splitTime.length === 2) {
      timeParam = `${splitTime[0]}m${splitTime[1]}s`;
    } else if (splitTime.length === 3) {
      timeParam = `${splitTime[0]}h${splitTime[1]}m${splitTime[2]}s`;
    }
  }

  const getShareUrl = () => {
    return videoInfo
      ? `https://waldbutton.vercel.app/${videoInfo.id}/${encodeURI(
          videoInfo.text
        )}`
      : "";
  };

  const handleLinkClick = () => {
    sendEvent({
      action: "link-click",
      category: "detail",
      label: videoInfo ? videoInfo.text + "@" + videoInfo.id : "unknown",
    });
  };

  const handleFavoriteClick = () => {
    if (!videoInfo) return;

    if (inFavorite(videoInfo)) {
      removeFavorite(videoInfo);
    } else {
      addFavorite(videoInfo);
    }
  };

  const handlePlaying = () => {
    sendEvent({
      action: "play",
      category: "audio",
      label: videoInfo ? videoInfo.text + "@" + videoInfo.id : "",
    });
  };

  const handleDoNothing = () => {
    // do nothing
  };

  return (
    <Dialog isOpen={isOpen} onClose={props.onClose}>
      <div
        className={Classes.DIALOG_BODY}
      >
        {!videoInfo || videoInfo.title === "" ? (
          <div>
            <div css={thumbBox}>
              <img
                css={thumbImage}
                src="/static/image/thumb_dummy.png"
                width={320}
                height={180}
                alt="動画サムネイル"
              />
              <div css={controlBox}>
                {hasPrev ? (
                  <button css={controlButton} onClick={onPrev}>
                    <Icon icon="chevron-left" size={35} />
                  </button>
                ) : (
                  <div />
                )}
                {hasNext ? (
                  <button css={controlButton} onClick={onNext}>
                    <Icon icon="chevron-right" size={35} />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
            <span>動画情報が見つかりませんでした</span>
          </div>
        ) : (
          <>
            <div
              css={css`
                margin-bottom: 10px;
              `}
            >
              <div css={thumbBox}>
                <img
                  key={videoInfo.id}
                  css={thumbImage}
                  src={videoInfo.thumbnailUrl}
                  width={320}
                  height={180}
                  alt={videoInfo.title}
                />
                <div
                  css={css`
                    display: flex;
                    position: absolute;
                    bottom: -4px;
                    right: 15px;
                  `}
                >
                  <button
                    css={css`
                      margin: 0;
                      margin-right: 5px;
                      padding: 0;
                      width: 50px;
                      height: 50px;
                      border: 2px solid white;
                      border-radius: 50%;
                      background: #1c2127;
                      box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.3);
                      cursor: pointer;
                    `}
                    onClick={handleFavoriteClick}
                  >
                    <Icon
                      icon={inFavorite(videoInfo) ? "star" : "star-empty"}
                      size={28}
                      color={inFavorite(videoInfo) ? "#FFC940" : "#5F6B7C"}
                    />
                  </button>
                  <ButtonBase
                    css={css`
                      margin: 0;
                      padding: 0;
                      width: 50px;
                      height: 50px;
                      border: 2px solid white;
                      border-radius: 50%;
                      background-color: #215db0 !important;
                      box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.3);
                      cursor: pointer;
                    `}
                    voice={videoInfo}
                    showVideoInfo={false}
                    hideIcon={true}
                    hideBackground={true}
                    onVoicePlaying={handlePlaying}
                    onVideoInfoOpen={handleDoNothing}
                  >
                    <Icon icon="volume-up" size={28} color="white" />
                  </ButtonBase>
                </div>
                <div css={controlBox}>
                  {hasPrev ? (
                    <button css={controlButton} onClick={onPrev}>
                      <Icon icon="chevron-left" size={35} color="#000" />
                    </button>
                  ) : (
                    <div />
                  )}
                  {hasNext ? (
                    <button css={controlButton} onClick={onNext}>
                      <Icon icon="chevron-right" size={35} color="#000" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${videoInfo.id}`}
                onClick={handleLinkClick}
                target="_blank"
                rel="noreferrer"
                css={css`
                  display: block;
                  margin-bottom: 2px;
                `}
              >
                <div css={titleText}>{videoInfo.title}</div>
              </a>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <Icon
                  icon="time"
                  size={14}
                  css={css`
                    margin-right: 2px;
                  `}
                />
                <span>{dayjs(videoInfo.date).format("YYYY/MM/DD")}</span>
              </div>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${videoInfo.id}&t=${timeParam}`}
              onClick={handleLinkClick}
              target="_blank"
              rel="noreferrer"
              css={css`
                &:link,
                &:visited {
                  color: #182026;
                }

                .bp5-dark & {
                  &:link,
                  &:visited {
                    color: #f5f8fa;
                  }
                }
              `}
            >
              <div
                css={css`
                  margin-bottom: 12px;
                  display: flex;
                  align-items: flex-start;
                  font-size: 130%;
                  line-height: 1.3em;
                `}
              >
                <span css={timeTag}>{videoInfo.time || "--:--"}</span>
                <div css={voiceText}>
                  {videoInfo.text}
                  <Icon icon="share" style={{ opacity: 0.6 }} />
                </div>
              </div>
            </a>
            <div
              css={css`
                width: 100%;
                display: flex;
                gap: 4px;
                align-items: baseline;
              `}
            >
              <div
                css={css`
                  flex-shrink: 0;
                `}
              >
                共有リンク
              </div>
              <input
                type="text"
                readOnly
                css={css`
                  width: 100%;
                  padding: 1px 3px;
                  background: #f5f8fa;
                  border: 1px solid #bfccd6;
                  border-radius: 2px;
                  color: #000;
                `}
                value={getShareUrl()}
                onFocus={(e) => {
                  e.target.select(); // PC, Android向け
                  setTimeout(() => e.target.select(), 0); // iOS向け
                }}
                onMouseUp={(e) => e.preventDefault()} // Safariで this.select が効かない対策
              />
              <a
                css={shareButton}
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  getShareUrl()
                )}&text=${encodeURIComponent(
                  videoInfo.text + " - ワルトボタン"
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                ツイート
              </a>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default VideoInfo;
