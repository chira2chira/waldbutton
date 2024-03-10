import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@blueprintjs/core";
import { sendEvent } from "../../utils/gtag";
import { VoiceInfo } from "../../pages";
import ButtonBase from "../ButtonBase";

type RandomVoiceButtonProps = {
  voiceInfo: VoiceInfo[];
};

const RANDOM_UNDEFINED = "ランダム再生";
const emptyVoice: VoiceInfo = {
  url: "/static/voice/dummy.mp3", // 空はエラーが出るのでダミー
  id: "",
  text: RANDOM_UNDEFINED,
  kana: "",
  time: "",
  category: "common",
};

const RandomVoiceButton: React.FC<RandomVoiceButtonProps> = (props) => {
  const [playing, setPlaying] = useState(false);
  const [randomVoice, setRandomVoice] = useState(emptyVoice);
  const randomButtonRef = useRef<HTMLButtonElement>(null);

  const handlePlaying = () => {
    sendEvent({
      action: "play-random",
      category: "audio",
      label: randomVoice.text + "@" + randomVoice.id,
    });
  };

  const handleRandomPlay = useCallback(() => {
    const enableVoice = props.voiceInfo.filter((x) => !x.disabled);
    setRandomVoice(enableVoice[Math.floor(Math.random() * enableVoice.length)]);
    setPlaying(true);
  }, [props.voiceInfo]);

  useEffect(() => {
    if (randomVoice.text !== RANDOM_UNDEFINED) {
      randomButtonRef.current?.click();
    }
  }, [randomVoice.text]);

  const handlePlayEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  const dummyHandler = useCallback(() => {}, []);

  return (
    <>
      {playing ? (
        <ButtonBase
          ref={randomButtonRef}
          voice={randomVoice}
          showVideoInfo={false}
          onVoicePlaying={handlePlaying}
          onVoicePlayEnded={handlePlayEnded}
          onVideoInfoOpen={dummyHandler}
        />
      ) : (
        <Button onClick={handleRandomPlay}>ランダム再生</Button>
      )}
    </>
  );
};

export default React.memo(RandomVoiceButton);
