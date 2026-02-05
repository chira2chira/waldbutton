import React, { useCallback, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { Icon } from "@blueprintjs/core";
import { Tooltip } from "@blueprintjs/core";

const OfferButton: React.FC = () => {
  const [stickyOpen, setStickyOpen] = useState(true);

  const handleScroll = useCallback(() => {
    // スクロール状態でリロードした場合も即呼ばれる
    setStickyOpen(false);
    window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }, [handleScroll]);

  return (
    <Tooltip content="ネタ提供" isOpen={stickyOpen} placement="top">
      <a
        css={css`
          display: flex;
          width: 3.5em;
          height: 3.5em;
          border-radius: 50%;
          background: #215db0;
          box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
          align-items: center;
          justify-content: center;
        `}
        href="https://forms.gle/mujoNpAqbsEjc67M9"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setStickyOpen(true)}
        onMouseLeave={() => setStickyOpen(false)}
      >
        <Icon
          css={css`
            margin-top: -1px;
            margin-right: -1px;
          `}
          icon="inbox"
          size={30}
          color="#ffffff"
        />
      </a>
    </Tooltip>
  );
};

export default React.memo(OfferButton);
