import React from "react";
import { sendEvent } from "../../utils/gtag";
import { VoiceInfo } from "../../pages";
import ButtonBase from "../ButtonBase";

type VoiceButtonProps = {
  voice: VoiceInfo;
  showVideoInfo: boolean;
  onVideoInfoOpen: (videoInfo: VoiceInfo) => void;
};

const VoiceButton: React.FC<VoiceButtonProps> = (props) => {
  const { voice, showVideoInfo, onVideoInfoOpen } = props;

  const handlePlaying = () => {
    sendEvent({
      action: "play",
      category: "audio",
      label: voice.text + "@" + voice.id,
    });
  };

  const handleVideoInfoOpen = () => {
    onVideoInfoOpen(voice);
    sendEvent({
      action: "modal-open",
      category: "detail",
      label: voice.text + "@" + voice.id,
    });
  };

  return (
    <>
      <ButtonBase
        voice={voice}
        showVideoInfo={showVideoInfo}
        onVoicePlaying={handlePlaying}
        onVideoInfoOpen={handleVideoInfoOpen}
      />
    </>
  );
};

export default React.memo(VoiceButton);
