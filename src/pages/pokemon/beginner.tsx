import { Card, H2 } from "@blueprintjs/core";
import { css } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";
import CommonMeta from "../../components/CommonMeta";
import PokemonQuiz from "../../components/PokemonQuiz";
import TweetButton from "../../components/TweetButton";
import Container from "../../templates/Container";
import {
  loadPokemonMaster,
  loadPokemonVoice,
  PokemonMaster,
  PokemonVoice,
} from "../../utils/pokemon";

type BeginnerProps = {
  master: PokemonMaster[];
  voices: PokemonVoice[];
};

const Beginner: NextPage<BeginnerProps> = (props) => {
  return (
    <>
      <CommonMeta
        title="なきごえクイズ【初級】 - ワルトボタン"
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
          <TweetButton path="/pokemon/beginner" />
        </div>

        <Card>
          <H2>なきごえクイズ 初級</H2>
          <PokemonQuiz
            master={props.master}
            voices={props.voices}
            mode={0}
            count={10}
          />
        </Card>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<BeginnerProps> = async (
  context
) => {
  const master = loadPokemonMaster();
  const voices = loadPokemonVoice();

  return {
    props: {
      master,
      voices,
    },
  };
};

export default Beginner;
