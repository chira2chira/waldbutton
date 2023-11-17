import { css, keyframes } from "@emotion/react";
import { useContext, useRef, useState } from "react";
import { VolumeContext } from "../../providers/VolumeProvider";
import { sendEvent } from "../../utils/gtag";

// https://qiita.com/seahorse_saki/items/e064760f82832ff766bc
const buruburu = keyframes`
0% {
    transform: translate(0, 2px) rotateZ(0deg);
  }
  25% {
    transform: translate(2px, 0) rotateZ(1deg);
  }
  50% {
    transform: translate(2px, 2px) rotateZ(0deg);
  }
  75% {
    transform: translate(2px, 0) rotateZ(-1deg);
  }
  100% {
    transform: translate(0, 0) rotateZ(0deg);
  }
`;

const PokeWald: React.FC = (props) => {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const { volume } = useContext(VolumeContext);

  const handleAudioPlay = () => {
    const current = audio.current;
    if (!current) return;

    if (current.duration === undefined) {
      current.load();
    }
    new window.AudioContext(); // safari対策 https://rch850.hatenablog.com/entry/2021/07/26/015048
    current.volume = volume / 100;
    current.currentTime = 0;
    current.play();
    setPlaying(true);
    sendEvent({
      action: "play-aprilfool",
      category: "seasonal",
      label: "海好き？",
    });
  };

  return (
    <>
      <button
        css={css`
          background: none;
          border: none;
          cursor: pointer;
          animation: ${buruburu} ${playing ? "0.1s" : "0s"} infinite;
        `}
        onClick={handleAudioPlay}
      >
        <img
          src="/static/image/poke-wald.png"
          alt="ワルト(ゴキンジョモンスター)"
          height="100"
        />
      </button>
      <audio
        ref={audio}
        preload="none"
        src="/static/voice/海好き？って言われて.mp3"
        onEnded={() => setPlaying(false)}
      />
    </>
  );
};

export default PokeWald;
