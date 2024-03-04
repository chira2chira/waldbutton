import React, { useState } from "react";
import { VoiceBase } from "../../pages";
import { BottomToaster } from "../../utils/toast";
import { sendEvent } from "../../utils/gtag";

type ConnectProviderProps = {
  children?: React.ReactNode;
};

type ConnectContextProps = {
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
  playDiscord: (voice: VoiceBase) => Promise<void>;
};

export const ConnectContext = React.createContext<ConnectContextProps>(
  {} as ConnectContextProps
);

const ConnectProvider: React.FC<ConnectProviderProps> = (props) => {
  const [connecting, setConnecting] = useState(false);

  const connect = () => {
    setConnecting(true);
  };

  const disconnect = () => {
    setConnecting(false);
  };

  const playDiscord = async (voice: VoiceBase) => {
    try {
      const res = await fetch("/api/discord/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: voice.url }),
      });
      if (res.ok) {
        BottomToaster?.show({
          message: "VCで再生しました。",
          intent: "success",
        });
        sendEvent({
          action: "play-on-discord",
          category: "audio",
          label: voice.text + "@" + voice.id,
        });
      } else {
        const data = await res.json();
        BottomToaster?.show({
          message: data.message,
          intent: "warning",
        });
      }
    } catch (error) {
      BottomToaster?.show({
        message: "通信に失敗しました。",
        intent: "danger",
      });
    }
  };

  return (
    <ConnectContext.Provider
      value={{
        connecting,
        connect,
        disconnect,
        playDiscord,
      }}
    >
      {props.children}
    </ConnectContext.Provider>
  );
};

export default ConnectProvider;
