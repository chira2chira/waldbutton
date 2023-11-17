import React, { useEffect, useState } from "react";

const VOLUME_KEY = "volume";

type VolumeProviderProps = {
  children?: React.ReactNode;
};

type volumeContextProps = {
  volume: number;
  setVolume: (volume: number) => void;
};

export const VolumeContext = React.createContext<volumeContextProps>(
  {} as volumeContextProps
);

const VolumeProvider: React.FC<VolumeProviderProps> = (props) => {
  const [volume, _setVolume] = useState(100);

  const setVolume = (newValue: number) => {
    _setVolume(newValue);
    window.localStorage.setItem(VOLUME_KEY, newValue.toString());
  };

  useEffect(() => {
    // SSRを避けて取得する
    const storedValue = window.localStorage.getItem(VOLUME_KEY);
    if (storedValue) {
      _setVolume(Number(storedValue));
    }
  }, []);

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {props.children}
    </VolumeContext.Provider>
  );
};

export default VolumeProvider;
