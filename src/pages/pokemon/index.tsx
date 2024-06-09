import { Card, H2 } from "@blueprintjs/core";
import { css } from "@emotion/react";
import { NextPage } from "next";
import Link from "next/link";
import CommonMeta from "../../components/CommonMeta";
import TweetButton from "../../components/TweetButton";
import Container from "../../templates/Container";

const linkButton = css`
  padding: 15px 25px;
  width: 8em;
  border-radius: 4px;
  font-size: 180%;
  text-align: center;
  font-weight: bold;

  &&:any-link,
  &&:hover {
    color: white;
  }

  &:hover {
    text-decoration: none;
    box-shadow: none;
    transform: translateY(3px);
  }
`;

const Pokemon: NextPage = (props) => {
  return (
    <>
      <CommonMeta
        title="なきごえクイズ - ワルトボタン"
        cardType="summary_large_image"
        useTwitterWidget={true}
      />

      <Container>
        <div
          css={css`
            margin-bottom: 4px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
          `}
        >
          <TweetButton path="/pokemon" />
        </div>

        <Card>
          <H2>なきごえクイズ</H2>

          <div
            css={css`
              margin: 30px 0 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
            `}
          >
            <Link
              href={"/pokemon/beginner"}
              css={css`
                ${linkButton};
                background-color: #238551;
                box-shadow: 0 3px 0 #72ca9b;
              `}
            >
              初級に挑戦
            </Link>
            <Link
              href={"/pokemon/medium"}
              css={css`
                ${linkButton};
                background-color: #cd4246;
                box-shadow: 0 3px 0 #fa999c;
              `}
            >
              中級に挑戦
            </Link>
            <Link
              href={"/pokemon/practice"}
              css={css`
                ${linkButton};
                background-color: #2d72d2;
                box-shadow: 0 3px 0 #8abbff;
              `}
            >
              予習する
            </Link>
          </div>

          <p>
            <span>問題の生成アルゴリズムは</span>
            <a
              href="https://www.pokemon.jp/special/nakigoe151/"
              target="_blank"
              rel="noreferrer"
            >
              めざせ！なきごえマスター！なきごえ151
            </a>
            <span>を参考にしています。</span>
          </p>
        </Card>
      </Container>
    </>
  );
};

export default Pokemon;
