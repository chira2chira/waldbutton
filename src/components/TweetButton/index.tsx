import React from "react";

type TweetButtonProps = {
  path: string;
};

const TweetButton: React.VFC<TweetButtonProps> = (props) => {
  return (
    <div style={{ colorScheme: "auto", height: "24px" }}>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-show-count="false"
        data-url={"https://waldbutton.vercel.app" + props.path}
      >
        Tweet
      </a>
    </div>
  );
};

export default TweetButton;
