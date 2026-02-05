import React, { useContext, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import { Icon } from "@blueprintjs/core";
import { FavoriteContext } from "../../providers/FavoriteProvider";
import throttle from "lodash.throttle";

type OpenFavoriteButon = {
  drawerOpened: boolean;
  onClick: () => void;
};

const OpenFavoriteButton: React.FC<OpenFavoriteButon> = (props) => {
  const { editing } = useContext(FavoriteContext);
  const [textOpen, setTextOpen] = useState(true);
  const lastScrollY = useRef(99999);

  const handleScroll = () => {
    // iOSでバウンススクロールすると負の値になるので0にする
    const currentScrollY = window.scrollY < 0 ? 0 : window.scrollY;

    // lastScrollYはaddEventListener時点で固定されているためRefから取る
    if (lastScrollY.current >= currentScrollY) {
      // 上スクロール
      setTextOpen(true);
    } else {
      setTextOpen(false);
    }
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  return (
    <div
      css={css`
        display: inline-block;
      `}
    >
      <button
        css={css`
          display: flex;
          padding: 0 10px;
          width: ${editing ? "12em" : textOpen ? "10em" : "3.5em"};
          height: 3.5em;
          overflow: hidden;
          border: none;
          border-radius: 10px;
          background: #1c2127;
          box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
          align-items: center;
          cursor: pointer;
          transition: width 0.5s ease-in-out;
        `}
        onClick={props.onClick}
      >
        <Icon
          css={css`
            margin-top: -1px;
            margin-right: -1px;
          `}
          icon="star-empty"
          size={30}
          color="#FFC940"
        />
        <span
          css={css`
            display: ${editing || textOpen ? "block" : "none"};
            margin-left: 15px;
            white-space: nowrap;
            color: white;
          `}
        >
          {editing ? "管理モード終了" : "お気に入り"}
        </span>
      </button>
    </div>
  );
};

export default React.memo(OpenFavoriteButton);
