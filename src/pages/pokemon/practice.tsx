import { Card, H2, Icon } from "@blueprintjs/core";
import { css } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import ButtonBase from "../../components/ButtonBase";
import CommonMeta from "../../components/CommonMeta";
import TweetButton from "../../components/TweetButton";
import Container from "../../templates/Container";
import { sendEvent } from "../../utils/gtag";
import { loadPokemonVoice, PokemonVoice } from "../../utils/pokemon";

type PracticeProps = {
  voices: PokemonVoice[];
};

type SortType = "id" | "name";

const Practice: NextPage<PracticeProps> = (props) => {
  const [sortType, setSortType] = useState<SortType>("id");

  const sortVoice = (a: PokemonVoice, b: PokemonVoice) => {
    switch (sortType) {
      case "id":
        return Number(a.id) - Number(b.id);
      case "name":
        return a.text.localeCompare(b.text, "ja");
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.currentTarget.value as SortType);
  };

  return (
    <>
      <CommonMeta
        title="なきごえクイズ予習 - ワルトボタン"
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
          <TweetButton path="/pokemon/practice" />
        </div>

        <Card>
          <H2>なきごえクイズ 予習</H2>

          <p>
            <Link href="/pokemon">クイズトップに戻る</Link>
          </p>

          <p
            css={css`
              width: 100%;
              max-width: 560px;
              aspect-ratio: 16 / 9;

              & iframe {
                width: 100%;
                height: 100%;
              }
            `}
          >
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/an6r0FBBBl4"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </p>

          <div
            css={css`
              margin-bottom: 10px;
              text-align: right;
            `}
          >
            <div className="bp5-html-select">
              <select onChange={handleSortChange}>
                <option value="id">ポケモン図鑑順</option>
                <option value="name">五十音順</option>
              </select>
              <Icon icon="chevron-down" />
            </div>
          </div>

          <div
            css={css`
              display: flex;
              flex-wrap: wrap;
              gap: 3px;
            `}
          >
            {props.voices.sort(sortVoice).map((x) => (
              <NakigoeButton key={x.id} voice={x} />
            ))}
          </div>
        </Card>
      </Container>
    </>
  );
};

const NakigoeButton: React.FC<{ voice: PokemonVoice }> = (props) => {
  const { voice } = props;

  const handlePlaying = () => {
    sendEvent({
      action: "play-pokemon",
      category: "audio",
      label: voice.text,
    });
  };

  const handleDoNothing = () => {
    // do nothing
  };

  return (
    <div
      css={css`
        width: 115px;
      `}
    >
      <ButtonBase
        voice={voice}
        showVideoInfo={false}
        onPlaying={handlePlaying}
        onVideoInfoOpen={handleDoNothing}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps<PracticeProps> = async (
  context
) => {
  const voices = loadPokemonVoice();

  return {
    props: {
      voices,
    },
  };
};

export default Practice;
