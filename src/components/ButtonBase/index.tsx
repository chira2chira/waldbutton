import React, {
  ReactEventHandler,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { css } from "@emotion/react";
import { Button, ButtonProps, IconName, MaybeElement } from "@blueprintjs/core";
import Loading from "../Loading";
import { VolumeContext } from "../../providers/VolumeProvider";
import { FavoriteContext } from "../../providers/FavoriteProvider";
import { ConnectContext } from "../../providers/ConnectProvider";
import { BottomToaster } from "../../utils/toast";
import { VoiceBase } from "../../pages";

type VoiceButtonProps = ButtonProps & {
  voice: VoiceBase;
  showVideoInfo: boolean;
  hideIcon?: boolean;
  hideBackground?: boolean;
  preLoad?: boolean;
  onVoicePlaying: () => void;
  onVoicePlayEnded?: () => void;
  onVideoInfoOpen: () => void;
  children?: React.ReactNode;
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

const ButtonBase = forwardRef<HTMLButtonElement, VoiceButtonProps>(
  (props, ref) => {
    const {
      voice,
      showVideoInfo,
      hideIcon,
      hideBackground,
      preLoad,
      onVoicePlaying,
      onVoicePlayEnded,
      onVideoInfoOpen,
      children,
      ...buttonProps
    } = props;

    const audio = useRef<HTMLAudioElement>(null);
    const [status, setStatus] = useState<Status>("pause");
    const { volume } = useContext(VolumeContext);
    const { connecting, playDiscord } = useContext(ConnectContext);
    const { editing, addFavorite, removeFavorite, inFavorite } =
      useContext(FavoriteContext);

    useEffect(() => {
      if (audio.current) {
        audio.current.volume = volume / 100;
      }
    }, [volume]);

    const handleClick = async () => {
      if (editing) {
        if (inFavorite(voice)) {
          removeFavorite(voice);
        } else {
          addFavorite(voice);
        }
        return;
      } else if (showVideoInfo) {
        props.onVideoInfoOpen();
        return;
      } else if (connecting) {
        setStatus("buffer");
        playDiscord(voice).then(() => {
          handleEnded();
        });
        return;
      }

      const current = audio.current;
      if (!current) return;

      if (status === "error") {
        // 復帰のためリセットする
        current.load();
      }

      if (current.paused) {
        new window.AudioContext(); // safari対策 https://rch850.hatenablog.com/entry/2021/07/26/015048
        current.play();
        if (!current.duration) {
          setStatus("buffer");
        }
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
      onVoicePlaying();
    };

    const handleEnded = () => {
      setStatus("pause");
      if (onVoicePlayEnded) onVoicePlayEnded();
    };

    const handleError: ReactEventHandler<HTMLAudioElement> = (e) => {
      setStatus("error");
      BottomToaster?.show({
        intent: "danger",
        message: e.currentTarget.error?.message,
      });
    };

    const isPlaying =
      status === "play" &&
      audio.current &&
      audio.current.duration > 0 &&
      audio.current.duration !== Infinity;

    const buttonIcon =
      editing && inFavorite(voice)
        ? "star"
        : editing && !inFavorite(voice)
        ? "star-empty"
        : showVideoInfo
        ? "info-sign"
        : getStatusIcon(status);

    return (
      <>
        <Button
          ref={ref}
          css={css`
            position: relative;
            overflow: hidden;
            z-index: 0;
          `}
          icon={hideIcon ? undefined : buttonIcon}
          intent={editing ? "warning" : showVideoInfo ? "primary" : "none"}
          onClick={handleClick}
          {...buttonProps}
        >
          {children || voice.text}
          {!hideBackground && (
            <div
              css={css`
                position: absolute;
                width: 100%;
                top: 1px;
                left: 0;
                bottom: 1px;
                background: linear-gradient(
                  90deg,
                  rgba(255, 255, 255, 0) 40%,
                  #ced9e0 100%
                );
                transform: translateX(${isPlaying ? 0 : -101}%);
                transition: transform
                  ${isPlaying ? audio.current?.duration : 0}s 0s linear;
                z-index: -1;

                .bp6-dark & {
                  background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 40%,
                    #5f6b7c 100%
                  );
                }
              `}
            ></div>
          )}

          <audio
            ref={audio}
            preload={preLoad ? "auto" : "none"}
            src={voice.url}
            onPlaying={handlePlaying}
            onEnded={handleEnded}
            onError={handleError}
          />
        </Button>
      </>
    );
  }
);
ButtonBase.displayName = "ButtonBase";

export default React.memo(ButtonBase);
