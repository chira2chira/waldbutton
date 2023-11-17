import React, { useCallback, useEffect, useState } from "react";
import { VoiceBase } from "../../pages";
import { sendEvent } from "../../utils/gtag";

const FAVORITE_KEY = "favorite";

type Favorite = {
  text: string;
  id: string;
};

type FavoriteProviderProps = {
  children?: React.ReactNode;
};

type FavoriteContextProps = {
  editing: boolean;
  favorites: Favorite[];
  setEditing: (enable: boolean) => void;
  addFavorite: (voice: VoiceBase) => void;
  removeFavorite: (voice: VoiceBase) => void;
  updateFavorites: (favorites: Favorite[]) => void;
  inFavorite: (voice: VoiceBase) => boolean;
};

function parseFavorite(voice: VoiceBase): Favorite {
  return {
    text: voice.text,
    id: voice.id,
  };
}

export const FavoriteContext = React.createContext<FavoriteContextProps>(
  {} as FavoriteContextProps
);

const FavoriteProvider: React.FC<FavoriteProviderProps> = (props) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [editing, setEditing] = useState(false);

  const addFavorite = (voice: VoiceBase) => {
    const newFavorites = [...favorites, parseFavorite(voice)];
    setFavorites(newFavorites);
    window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(newFavorites));

    sendEvent({
      action: "add",
      category: "favorite",
      label: voice.text + "@" + voice.id,
    });
  };

  const removeFavorite = (voice: VoiceBase) => {
    const newFavorites = favorites.filter(
      (x) => !(x.text === voice.text && x.id === voice.id)
    );
    setFavorites(newFavorites);
    window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(newFavorites));

    sendEvent({
      action: "remove",
      category: "favorite",
      label: voice.text + "@" + voice.id,
    });
  };

  const updateFavorites = (favorites: Favorite[]) => {
    setFavorites(favorites);
    window.localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  };

  const inFavorite = useCallback(
    (voice: VoiceBase) => {
      return !!favorites.find(
        (x) => x.id === voice.id && x.text === voice.text
      );
    },
    [favorites]
  );

  useEffect(() => {
    // SSRを避けて取得する
    const storedValue = window.localStorage.getItem(FAVORITE_KEY);
    if (storedValue) {
      setFavorites(JSON.parse(storedValue));
    }
  }, []);

  return (
    <FavoriteContext.Provider
      value={{
        editing,
        favorites,
        setEditing,
        addFavorite,
        removeFavorite,
        updateFavorites,
        inFavorite,
      }}
    >
      {props.children}
    </FavoriteContext.Provider>
  );
};

export default FavoriteProvider;
