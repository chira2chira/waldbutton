import React from "react";
import { sendEvent } from "../../utils/gtag";
import { VoiceInfo } from "../../pages";
import ButtonBase from "../ButtonBase";

type SimpleVoiceButtonProps = {
  voice: VoiceInfo;
};

const SimpleVoiceButton: React.FC<SimpleVoiceButtonProps> = (props) => {
  const { voice } = props;

  const handlePlaying = () => {
    sendEvent({
      action: "play-in-ranking",
      category: "audio",
      label: voice.text + "@" + voice.id,
    });
  };

  const handleDoNothing = () => {
    // do nothing
  };

  return (
    <>
      <ButtonBase
        minimal={true}
        voice={voice}
        showVideoInfo={false}
        onVoicePlaying={handlePlaying}
        onVideoInfoOpen={handleDoNothing}
      />
    </>
  );
};

export default React.memo(SimpleVoiceButton);
