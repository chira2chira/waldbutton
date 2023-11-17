import { css } from "@emotion/react";
import { getModeString, Quiz } from ".";
import { PokemonMaster, PokemonVoice } from "../../utils/pokemon";
import CheckCorrectComponent from "./CheckCorrectComponent";

type ResultProps = {
  mode: number;
  quiz: Quiz[];
  result: number[];
  master: PokemonMaster[];
  voices: PokemonVoice[];
};

const shareButton = css`
  margin-bottom: 20px;
  display: flex;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 11px;
  background: #1d9bf0;
  color: white !important;
  gap: 5px;

  &:hover {
    text-decoration: none;
    background: #0c7abf;
    color: white;
  }
`;

const ResultComponent: React.FC<ResultProps> = (props) => {
  const { quiz, result, master, voices } = props;
  const correctCount = quiz
    .map((x, i) => x.correctId === result[i])
    .filter((y) => y).length;

  return (
    <div>
      <div
        css={css`
          margin-bottom: 10px;
          font-size: 120%;
        `}
      >
        {quiz.length}問中
        <span
          css={css`
            margin-left: 5px;
            font-size: 150%;
            font-weight: bold;
            color: #cd4246;
          `}
        >
          {correctCount}問正解！
        </span>
      </div>

      <a
        css={shareButton}
        href={`https://twitter.com/share?url=${encodeURIComponent(
          "https://waldbutton.vercel.app/pokemon"
        )}&text=${encodeURIComponent(
          "ワルトなきごえクイズ【" +
            getModeString(props.mode) +
            "】" +
            quiz.length +
            "問中 " +
            correctCount +
            "問 正解しました！"
        )}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/static/svg/twitter_white.svg"
          alt="Twitter"
          width={16}
          height={16}
        />
        結果をシェア
      </a>

      {quiz.map((x, i) => {
        const select = master.find((y) => y.id === result[i]);
        const correct = voices.find((y) => Number(y.id) === x.correctId);
        if (select === undefined || correct === undefined) return null;

        return (
          <CheckCorrectComponent
            key={i}
            index={i}
            select={select}
            correct={correct}
          />
        );
      })}
    </div>
  );
};

export default ResultComponent;
