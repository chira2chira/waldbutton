import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import { Card, H5, Switch } from "@blueprintjs/core";
import { VoiceInfo } from "../../pages";
import * as styles from "../../styles/Home.module";
import VoiceButton from "../VoiceButton";

type CategoryCardProps = {
  title: string;
  hideDetails?: boolean;
  voiceInfo: VoiceInfo[];
  onVideoInfoOpen: (videoInfo: VoiceInfo) => void;
};

const CategoryCard: React.VFC<CategoryCardProps> = (props) => {
  const [showInfo, setShowInfo] = useState(false);

  const handleShowChange = () => {
    setShowInfo(!showInfo);
  };

  return (
    <Card css={styles.voiceCard}>
      <div css={styles.cardHead}>
        <H5>{props.title}</H5>
        {!props.hideDetails && (
          <Switch
            label="動画情報表示"
            checked={showInfo}
            onChange={handleShowChange}
          />
        )}
      </div>
      <LazyLoad height={200}>
        <div css={styles.voiceList}>
          {props.voiceInfo.map((voice) => {
            return (
              <VoiceButton
                key={voice.url}
                voice={voice}
                showVideoInfo={showInfo}
                onVideoInfoOpen={props.onVideoInfoOpen}
              />
            );
          })}
        </div>
      </LazyLoad>
    </Card>
  );
};

export default React.memo(CategoryCard);
