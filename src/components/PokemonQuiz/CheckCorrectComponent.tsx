import { Icon } from "@blueprintjs/core";
import { css } from "@emotion/react";
import { PokemonMaster, PokemonVoice } from "../../utils/pokemon";
import PokemonQuizVoiceButton from "../PokemonQuizVoiceButton";

type CheckCorrectProps = {
  index: number;
  select: PokemonMaster;
  correct: PokemonVoice;
};

const title = css`
  display: inline-block;
  width: 58px;
  &::after {
    content: "：";
  }
`;

const CheckCorrectComponent: React.FC<CheckCorrectProps> = (props) => {
  const { index, select, correct } = props;

  const corrected = select.id === Number(correct.id);

  return (
    <div
      css={css`
        margin-bottom: 8px;
        line-height: 1.5;
        display: flex;
        align-items: center;
        gap: 10px;
      `}
    >
      <div>
        <PokemonQuizVoiceButton voice={correct} currentIndex={index} />
      </div>
      <div>
        <div
          css={css`
            display: flex;
          `}
        >
          <div css={title}>{index + 1}問目</div>
          <div>
            {corrected ? (
              <Icon icon="circle" color="#AC2F33" size={18} />
            ) : (
              <Icon icon="cross" color="#215DB0" size={18} />
            )}
          </div>
          {select.name}
        </div>

        {!corrected && (
          <div>
            <div css={title}>正解</div>
            {correct.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckCorrectComponent;
