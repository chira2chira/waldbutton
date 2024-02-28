import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import { Card, Colors, H5, Icon, Switch } from "@blueprintjs/core";
import { css } from "@emotion/react";
import dayjs from "dayjs";
import { VoiceInfo, YouTubeInfo } from "../../pages";
import * as styles from "../../styles/Home.module";
import VoiceButton from "../VoiceButton";

type VideoCardProps = {
  youtubeInfo: YouTubeInfo;
  voiceInfo: VoiceInfo[];
  onVideoInfoOpen: (videoInfo: VoiceInfo, youtubeInfo: YouTubeInfo) => void;
};

const switchBox = css`
  position: absolute;
  top: 12px;
  right: 20px;

  @media (max-width: 420px) {
    top: 0;
    right: 0;
    padding: 10px 7px 0 7px;
    border-radius: 0 3px 0 3px;
    background: #ffffff;

    .bp5-dark & {
      background: ${Colors.DARK_GRAY3};
    }
  }
`;

const cardContainer = css`
  margin-top: 18px;
  display: flex;
  gap: 10px;

  @media (max-width: 420px) {
    margin-top: 0;
    flex-direction: column;
    gap: 2px;
  }
`;

const thumbBox = css`
  @media (max-width: 420px) {
    margin: -20px -20px 10px -20px;
  }
`;

const thumbImage = css`
  background: #bfccd6;

  @media (max-width: 420px) {
    width: 100%;
    height: 100%;
    border-radius: 3px 3px 0 0;
  }
`;

const VideoCard: React.VFC<VideoCardProps> = (props) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleShowChange = () => {
    setShowInfo(!showInfo);
  };

  const handleVideoInfoOpen = (videoInfo: VoiceInfo) => {
    props.onVideoInfoOpen(videoInfo, props.youtubeInfo);
  };

  return (
    <Card css={styles.voiceCard}>
      <div css={switchBox}>
        <Switch
          label="動画情報表示"
          checked={showInfo}
          onChange={handleShowChange}
        />
      </div>
      <div css={cardContainer}>
        <div css={thumbBox}>
          <LazyLoad height={180}>
            <a
              href={`https://www.youtube.com/watch?v=${props.youtubeInfo.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                css={thumbImage}
                src={props.youtubeInfo.thumbnailUrl}
                width={320}
                height={180}
                alt={props.youtubeInfo.title}
              />
            </a>
          </LazyLoad>
        </div>
        <div>
          <H5
            css={css`
              margin-bottom: 2px;
            `}
          >
            {props.youtubeInfo.title}
          </H5>
          <div
            css={css`
              display: flex;
              align-items: center;
              margin-bottom: 5px;
            `}
          >
            <Icon
              icon="time"
              size={14}
              css={css`
                margin-right: 2px;
              `}
            />
            <span>{dayjs(props.youtubeInfo.date).format("YYYY/MM/DD")}</span>
          </div>
          <LazyLoad height={100}>
            <div css={styles.voiceList}>
              {props.voiceInfo.map((voice) => (
                <VoiceButton
                  key={voice.url}
                  voice={voice}
                  showVideoInfo={showInfo}
                  onVideoInfoOpen={handleVideoInfoOpen}
                />
              ))}
            </div>
          </LazyLoad>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(VideoCard);
