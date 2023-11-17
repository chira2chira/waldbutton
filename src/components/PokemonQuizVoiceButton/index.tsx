import React from "react";
import { sendEvent } from "../../utils/gtag";
import ButtonBase from "../ButtonBase";
import { PokemonVoice } from "../../utils/pokemon";
import { Icon } from "@blueprintjs/core";
import { getModeString } from "../PokemonQuiz";
import { css } from "@emotion/react";

type PokemonQuizButtonProps = {
  voice: PokemonVoice;
  currentIndex: number;
  size?: number;
};

const PokemonQuizVoiceButton: React.FC<PokemonQuizButtonProps> = (props) => {
  const { voice, currentIndex, size } = props;

  const handlePlaying = () => {
    sendEvent({
      action: "play-quiz",
      category: "audio",
      label: getModeString(voice.mode) + "@" + (currentIndex + 1) + "問目",
    });
  };

  const handleDoNothing = () => {
    // do nothing
  };

  return (
    <>
      <ButtonBase
        css={
          size &&
          css`
            width: ${size * 2}px;
            height: ${size * 2}px;
          `
        }
        voice={voice}
        showVideoInfo={false}
        hideIcon={true}
        preLoad={true}
        onPlaying={handlePlaying}
        onVideoInfoOpen={handleDoNothing}
      >
        <Icon icon="volume-up" size={size} />
      </ButtonBase>
    </>
  );
};

export default React.memo(PokemonQuizVoiceButton);
