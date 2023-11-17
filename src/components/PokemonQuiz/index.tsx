import { Button, H3, Radio, RadioGroup } from "@blueprintjs/core";
import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { PokemonMaster, PokemonVoice } from "../../utils/pokemon";
import PokemonQuizVoiceButton from "../PokemonQuizVoiceButton";
import ResultComponent from "./ResultComponent";

type PokemonQuizProps = {
  master: PokemonMaster[];
  voices: PokemonVoice[];
  mode: number;
  count: number;
};

export type Quiz = {
  correctId: number;
  selectIds: number[];
};

function randomChoise<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const clone = [...array];
  for (let i = clone.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    // 配列の要素の順番を入れ替える
    let tmpStorage = clone[i];
    clone[i] = clone[rand];
    clone[rand] = tmpStorage;
  }

  return clone;
}

function generateQuiz(
  master: PokemonMaster[],
  voices: PokemonVoice[],
  mode: number,
  count: number
): Quiz[] {
  const filterdVoices = voices.filter((x) => x.mode === mode);
  const voiceIds = filterdVoices.map((x) => Number(x.id));
  // 存在しないボイスもあるためモードと存在するボイスでフィルタ
  const filterdMaster = master.filter((x) => voiceIds.includes(x.id));

  const quiz: Quiz[] = [];

  for (let i = 0; i < count; i++) {
    const correctId = Number(randomChoise(filterdVoices).id);
    const selectIds = [correctId];

    while (selectIds.length < 3) {
      const selectId = randomChoise(filterdMaster).id;
      if (!selectIds.includes(selectId)) {
        selectIds.push(selectId);
      }
    }
    quiz.push({
      correctId,
      selectIds: shuffleArray(selectIds),
    });
  }
  return quiz;
}

export function getModeString(mode: number) {
  switch (mode) {
    case 0:
      return "初級";
    case 1:
      return "中級";
    case 2:
      return "上級";
  }
}

const PokemonQuiz: React.FC<PokemonQuizProps> = (props) => {
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const currentQRef = useRef(currentQ);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [result, setResult] = useState<number[]>([]);
  const router = useRouter();

  const pageChangeHandler = () => {
    if (currentQRef.current < props.count) {
      const answer = window.confirm(
        "回答状況がリセットされます、本当にページ遷移しますか？"
      );
      if (!answer) {
        router.events.emit("routeChangeError");
        throw "Abort route";
      }
    }
  };

  const handleNext = () => {
    if (selectedId === undefined) return;

    setResult([...result, selectedId]);
    setSelectedId(undefined);
    setCurrentQ(currentQ + 1);
    currentQRef.current = currentQ + 1;
  };

  const handleReset = () => {
    setResult([]);
    setSelectedId(undefined);
    setCurrentQ(0);
    currentQRef.current = 0;
    setQuiz(generateQuiz(props.master, props.voices, props.mode, props.count));
  };

  useEffect(() => {
    setQuiz(generateQuiz(props.master, props.voices, props.mode, props.count));
  }, [props.count, props.master, props.mode, props.voices]);

  useEffect(() => {
    router.events.on("routeChangeStart", pageChangeHandler);
    return () => {
      router.events.off("routeChangeStart", pageChangeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (quiz.length === 0) return null;

  const finished = currentQ === props.count;
  const correctVoice = finished
    ? undefined
    : props.voices.find((x) => quiz[currentQ].correctId === Number(x.id));
  const selectPokemon = finished
    ? []
    : props.master.filter((x) => quiz[currentQ].selectIds.includes(x.id));

  if (finished) {
    return (
      <>
        <ResultComponent
          mode={props.mode}
          quiz={quiz}
          result={result}
          master={props.master}
          voices={props.voices}
        />
        <div
          css={css`
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          `}
        >
          <Button
            css={css`
              padding: 10px 30px;
              font-size: 130%;
            `}
            onClick={handleReset}
          >
            もう一度挑戦する
          </Button>
          <Link href="/pokemon">クイズトップに戻る</Link>
        </div>
      </>
    );
  }

  if (correctVoice === undefined) return null;

  return (
    <div>
      <H3>{currentQ + 1}問目</H3>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          css={css`
            margin-bottom: 20px;
            font-size: 120%;
            text-align: center;
          `}
        >
          <p>このなきごえのポケモンは？</p>
          <PokemonQuizVoiceButton
            voice={correctVoice}
            currentIndex={currentQ}
            size={50}
          />
        </div>
        <div
          css={css`
            margin-bottom: 10px;
          `}
        >
          <RadioGroup
            css={css`
              & > label {
                padding: 5px 0;
                width: 150px;
              }
            `}
            selectedValue={selectedId}
            onChange={(e) => setSelectedId(Number(e.currentTarget.value))}
          >
            <Radio label={selectPokemon[0].name} value={selectPokemon[0].id} />
            <Radio label={selectPokemon[1].name} value={selectPokemon[1].id} />
            <Radio label={selectPokemon[2].name} value={selectPokemon[2].id} />
          </RadioGroup>
        </div>
        <Button
          css={css`
            margin-bottom: 20px;
            padding: 20px 0;
            width: 200px;
            font-size: 120%;
          `}
          intent="primary"
          onClick={handleNext}
          disabled={selectedId === undefined}
        >
          {currentQ < props.count - 1 ? "次の問題に進む" : "結果を見る！"}
        </Button>
        <Link
          href="/pokemon"
          css={css`
            &:any-link,
            &&:hover {
              color: #5f6b7c;
            }

            .bp4-dark &:any-link,
            .bp4-dark &&:hover {
              color: #8f99a8;
            }
          `}
        >
          中断してクイズトップに戻る
        </Link>
      </div>
    </div>
  );
};

export default PokemonQuiz;
