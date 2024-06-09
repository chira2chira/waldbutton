import Link from "next/link";
import { H1 } from "@blueprintjs/core";
import React from "react";
import * as styles from "./styles";
import { css } from "@emotion/react";
import { YouTube7k } from "../../components/Svgs";

type ContainerProps = {
  children: React.ReactNode;
};

const Container: React.VFC<ContainerProps> = (props) => {
  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <div css={styles.headerContainer}>
          <Link href="/">
            <YouTube7k />
            <H1 css={styles.title}>ワルトボタン</H1>
          </Link>
          <div
            css={css`
              display: flex;
              gap: 10px;
            `}
          >
            <Link href="/game/pairs" css={styles.headerApp}>
              <img
                src="/static/svg/card.svg"
                alt="くしゃみ神経衰弱"
                width={30}
                height={30}
              />
              <span>神経衰弱</span>
            </Link>
            <Link href="/pokemon" css={styles.headerApp}>
              <img
                src="/static/svg/pokeball.svg"
                alt="なきごえクイズ"
                width={30}
                height={30}
              />
              <span>クイズ</span>
            </Link>
            <Link href="/ranking" css={styles.headerApp}>
              <img
                src="/static/svg/ranking.svg"
                alt="ランキング"
                width={30}
                height={30}
              />
              <span>ランキング</span>
            </Link>
          </div>
        </div>
      </div>

      <main css={styles.main}>{props.children}</main>

      <footer css={styles.footer}>
        <div>
          <span>作った人：</span>
          <a
            href="https://twitter.com/chira2chira"
            target="_blank"
            rel="noreferrer"
          >
            @chira2chira
          </a>
        </div>
        <div>
          個人のファンサイトであり、ご本人とは無関係です。権利者様からの削除要請などがありましたら迅速に対応いたします。
        </div>
        <div>音源の著作権は逢魔牙ワルトさんご本人に帰属します。</div>
      </footer>
    </div>
  );
};

export default Container;
