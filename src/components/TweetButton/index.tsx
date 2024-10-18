import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";

type TweetButtonProps = {
  path: string;
};

const TweetButton: React.VFC<TweetButtonProps> = (props) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(document.title);
  }, []);

  return (
    <a
      css={css`
        height: 20px;
        padding: 1px 12px;
        border-radius: 10px;
        background-color: #000;
        color: #fff;
        font-size: 12px;
        line-height: 18px;

        &:link,
        &:visited,
        &:hover {
          color: #fff !important;
          text-decoration: none;
        }

        &:hover {
          background-color: #333;
        }
      `}
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
        "https://waldbutton.vercel.app" + props.path
      )}&text=${encodeURIComponent(title)}`}
      target="_blank"
      rel="noreferrer"
    >
      <span
        css={css`
          &::before {
            content: "";
            position: relative;
            top: 2px;
            margin-right: 3px;
            width: 14px;
            height: 14px;
            display: inline-block;
            background: transparent 0 0 no-repeat;
            background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3Csvg viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' fill='none'/%3E%3Cpath d='M17.9686 14.1623L26.7065 4H24.6358L17.0488 12.8238L10.9891 4H4L13.1634 17.3432L4 28H6.07069L14.0827 18.6817L20.4822 28H27.4714L17.9681 14.1623H17.9686ZM15.1326 17.4607L14.2041 16.132L6.81679 5.55961H9.99723L15.9589 14.0919L16.8873 15.4206L24.6368 26.5113H21.4564L15.1326 17.4612V17.4607Z' fill='white'/%3E%3C/svg%3E%0A");
          }
        `}
      >
        ポスト
      </span>
    </a>
  );
};

export default TweetButton;
