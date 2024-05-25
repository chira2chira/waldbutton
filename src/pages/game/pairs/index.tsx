import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Card, H2, HTMLSelect } from "@blueprintjs/core";
import { css, keyframes } from "@emotion/react";
import { GetStaticProps, NextPage } from "next";
import { VolumeContext } from "../../../providers/VolumeProvider";
import Container from "../../../templates/Container";
import CommonMeta from "../../../components/CommonMeta";
import TweetButton from "../../../components/TweetButton";
import { loadSneeze } from "../../../utils/pairs";
import { sendEvent } from "../../../utils/gtag";

const PLAYER1_COLOR = "#2D72D2";
const PLAYER2_COLOR = "#CD4246";

type PairsProps = {
  voices: string[];
};

type GameMode = "cpu:easy" | "cpu:normal" | "cpu:hard" | "offline";
type Player = "player1" | "player2";

type CardProps = {
  open: boolean;
  owner: "" | Player;
  voice: string;
};

function wait(ms: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, ms)
  );
}

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; 0 < i; i--) {
    // 0～(i+1)の範囲で値を取得
    let r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}

const Pairs: NextPage<PairsProps> = (props) => {
  const { voices } = props;
  const [count, setCount] = useState(12);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [openCount, setOpenCount] = useState<number[]>([]);
  const [playerPoint, setPlayerPoint] = useState([0, 0]);
  const [playerName, setPlayerName] = useState(["プレイヤー", "CPU"]);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("cpu:easy");
  const [turnPlayer, setTurnPlayer] = useState<Player>("player1");
  const [systemMessage, setSystemMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  // console.log(turnPlayer, gameMode);

  const startGame = () => {
    if (playing) {
      setPlaying(false);
      setSystemMessage("");
      return;
    }
    const choice: string[] = [];
    for (let i = 0; i < count / 2; i++) {
      while (true) {
        const voice = voices[Math.floor(Math.random() * voices.length)];
        if (!choice.includes(voice)) {
          choice.push(voice);
          choice.push(voice);
          break;
        }
      }
    }
    setCards(
      shuffle(choice).map((x) => ({
        open: false,
        owner: "",
        voice: x,
      }))
    );
    if (gameMode.startsWith("cpu")) {
      setPlayerName(["プレイヤー", "CPU"]);
      setTurnPlayer("player1");
    } else {
      setPlayerName(["プレイヤー1", "プレイヤー2"]);
      setTurnPlayer(
        Math.floor(Math.random() * 100) % 2 === 0 ? "player1" : "player2"
      );
    }
    setPlaying(true);
    setBusy(false);
    setSelected([]);
    setPlayerPoint([0, 0]);
    setOpenCount(new Array<number>(count).fill(0));
    sendEvent({
      action: "start",
      category: "pairs",
      label: gameMode,
    });
  };

  const flip = (index: number) => {
    if (!playing || busy || cards[index].open || selected.includes(index))
      return;

    setSelected([...selected, index]);
    setOpenCount(openCount.map((x, i) => (i === index ? x + 1 : x)));
  };

  const execCpuTurn = async () => {
    // 既知とする閾値
    const threshold =
      gameMode === "cpu:easy" ? 4 : gameMode === "cpu:normal" ? 2 : 0;

    await wait(700);
    // 1枚目
    let tCards = cards
      .map((x, i) => ({ ...x, index: i }))
      .filter((x) => !x.open);
    let firstIndex = -1;
    if (gameMode === "cpu:easy" || gameMode === "cpu:normal") {
      const unkownCards = tCards.filter(
        (x) => openCount[x.index] < threshold + 1
      );
      if (unkownCards.length > 0) {
        // 既知のカードは開かない
        firstIndex =
          unkownCards[Math.floor(Math.random() * unkownCards.length)].index;
      } else {
        firstIndex = tCards[Math.floor(Math.random() * tCards.length)].index;
      }
    } else {
      // 既に開示済みのペアがないか探す
      let skip = false;
      for (let i = 0; i < tCards.length; i++) {
        if (
          tCards.filter(
            (x) => x.voice === tCards[i].voice && openCount[x.index] > threshold
          ).length === 2
        ) {
          firstIndex = tCards[i].index;
          skip = true;
          break;
        }
      }
      if (!skip) {
        const unknowns = tCards.filter(
          (x) => openCount[x.index] < threshold + 1
        );
        firstIndex =
          unknowns[Math.floor(Math.random() * unknowns.length)].index;
      }
    }
    setSelected([firstIndex]);

    await wait(1200);

    // 2枚目
    tCards = tCards.filter((x) => x.index !== firstIndex);
    let secondIndex = -1;
    const knownCards = tCards.filter(
      (x) =>
        cards[firstIndex].voice === x.voice && openCount[x.index] > threshold
    );
    if (knownCards.length > 0) {
      secondIndex = knownCards[0].index;
    } else if (gameMode === "cpu:hard") {
      // 既知のカードを選択する
      const opened = tCards.filter((x) => openCount[x.index] > 0);
      secondIndex = opened[Math.floor(Math.random() * opened.length)].index;
    } else {
      secondIndex = tCards[Math.floor(Math.random() * tCards.length)].index;
    }
    setSelected([firstIndex, secondIndex]);
    setOpenCount(
      openCount.map((x, i) =>
        [firstIndex, secondIndex].includes(i) ? x + 1 : x
      )
    );
  };

  // ペア判定
  useEffect(() => {
    if (selected.length == 2) {
      setBusy(true);

      setTimeout(() => {
        if (cards[selected[0]].voice === cards[selected[1]].voice) {
          setPlayerPoint((x) => {
            const newPoint = [...x];
            if (turnPlayer === "player1") newPoint[0] += 2;
            if (turnPlayer === "player2") newPoint[1] += 2;
            return newPoint;
          });
          const newCards = cards.map((x, i) => ({
            ...x,
            open: selected.includes(i) ? true : x.open,
            owner: selected.includes(i) ? turnPlayer : x.owner,
          }));
          setCards(newCards);
          setPopupMessage("🎉正解！🎉");
        } else {
          setTurnPlayer(turnPlayer === "player1" ? "player2" : "player1");
          setPopupMessage("残念！");
        }

        setBusy(false);
        setSelected([]);

        setTimeout(() => {
          setPopupMessage("");
        }, 1000);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // 終了判定
  useEffect(() => {
    if (cards.length === cards.filter((x) => x.open).length) {
      if (playerPoint[0] === 0 && playerPoint[1] === 0) {
        setSystemMessage("");
      } else if (playerPoint[0] > playerPoint[1]) {
        setSystemMessage(`${playerName[0]}の勝利`);
      } else if (playerPoint[0] < playerPoint[1]) {
        setSystemMessage(`${playerName[1]}の勝利`);
      } else {
        setSystemMessage("引き分け");
      }
      setPlaying(false);
      sendEvent({
        action: "finish",
        category: "pairs",
        label: gameMode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPoint]);

  // CPUターン判定
  useEffect(() => {
    (async () => {
      if (
        selected.length === 0 &&
        cards.filter((x) => x.open).length !== count &&
        turnPlayer === "player2" &&
        gameMode.startsWith("cpu") &&
        playing
      ) {
        setBusy(true);
        await execCpuTurn();
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <>
      <CommonMeta
        title="くしゃみ神経衰弱 - ワルトボタン"
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
          <TweetButton path="/game/pairs" />
        </div>

        <Card>
          <H2>くしゃみ神経衰弱</H2>

          <div
            css={css`
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 10px;
            `}
          >
            <div>ゲームモード</div>
            <HTMLSelect
              iconName="caret-down"
              disabled={playing}
              options={[
                { value: "cpu:easy", label: "VS CPU（よわい）" },
                { value: "cpu:normal", label: "VS CPU（ふつう）" },
                { value: "cpu:hard", label: "VS CPU（鬼）" },
                { value: "offline", label: "オフライン対戦" },
              ]}
              onChange={(e) => setGameMode(e.currentTarget.value as any)}
            />
            <HTMLSelect
              iconName="caret-down"
              disabled={playing}
              options={[
                { value: 12, label: "12枚" },
                { value: 16, label: "16枚" },
                { value: 20, label: "20枚" },
                { value: 24, label: "24枚" },
              ]}
              onChange={(e) => setCount(Number(e.currentTarget.value))}
            />
          </div>
          <div
            css={css`
              margin-bottom: 20px;
            `}
          >
            <Button
              large
              intent={playing ? "warning" : "primary"}
              outlined={playing}
              disabled={busy}
              onClick={startGame}
            >
              {playing ? "やめる" : "ゲーム開始"}
            </Button>
          </div>

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
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                text-align: center;
                line-height: 1.4;

                @media (max-width: 64em) {
                  width: 220px;
                }
              `}
            >
              <div
                css={css`
                  padding: 5px 10px;
                  border: 2px solid ${PLAYER1_COLOR};
                  border-radius: 5px;
                `}
              >
                {playerName[0]}
                <br />
                {playerPoint[0]}ポイント
              </div>
              <div
                css={css`
                  width: 180px;

                  @media (max-width: 64em) {
                    width: 100%;
                    margin-top: 10px;
                    flex-shrink: 0;
                    order: 3;
                  }
                `}
              >
                {playing ? (
                  <>
                    <span
                      css={css`
                        color: ${turnPlayer === "player1"
                          ? PLAYER1_COLOR
                          : PLAYER2_COLOR};
                        font-weight: 600;
                      `}
                    >
                      {turnPlayer === "player1" ? playerName[0] : playerName[1]}
                    </span>{" "}
                    のターン
                  </>
                ) : (
                  systemMessage
                )}
              </div>
              <div
                css={css`
                  padding: 5px 10px;
                  border: 2px solid ${PLAYER2_COLOR};
                  border-radius: 5px;
                `}
              >
                {playerName[1]}
                <br />
                {playerPoint[1]}ポイント
              </div>
            </div>

            <div
              css={css`
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px 10px;
              `}
            >
              {cards.map((x, i) => (
                <div key={i} onClick={() => flip(i)}>
                  <SoundCard
                    open={selected.includes(i) || x.open}
                    owner={x.owner}
                    voice={x.voice}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Container>

      <PopupMessage message={popupMessage} />
    </>
  );
};

type SoundCardProps = CardProps & {};

const SoundCard: React.FC<SoundCardProps> = (props) => {
  // console.log(props.voice);
  const audio = useRef<HTMLAudioElement>(null);
  const { volume } = useContext(VolumeContext);

  useEffect(() => {
    if (!props.open) return;

    const current = audio.current;
    if (!current) return;

    if (current.duration === undefined) {
      current.load();
    }
    current.volume = volume / 100;

    if (!current.paused) {
      current.pause();
      current.currentTime = 0;
    }
    current.play();
  }, [props.open, volume]);
  return (
    <>
      <div className={props.open ? "open" : ""}>
        <div
          css={css`
            width: 100px;
            height: 150px;
            position: relative;
            cursor: pointer;
            transition-duration: 0.4s;
            transition-timing-function: ease-in-out;
            transform-style: preserve-3d;

            @media (max-width: 64em) {
              width: 70px;
              height: 105px;
            }

            .open & {
              transform: rotateY(180deg);
            }

            .front,
            .back {
              display: flex;
              align-items: center;
              justify-content: center;

              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;

              backface-visibility: hidden;
              transform: rotateX(0deg);
            }

            .back {
              z-index: 2;
            }

            .front {
              transform: rotateY(180deg);
            }
          `}
        >
          <img
            className="back"
            src="/static/image/card_back.png"
            alt="トランプ裏"
          />
          <img
            className={`front ${props.owner}`}
            css={css`
              border-radius: 5px;

              &.player1 {
                outline: 2px solid ${PLAYER1_COLOR};
              }
              &.player2 {
                outline: 2px solid ${PLAYER2_COLOR};
              }
            `}
            src="/static/image/card_front.png"
            alt="トランプ表"
          />
        </div>
      </div>

      <audio ref={audio} src={props.voice} preload="auto" />
    </>
  );
};

const popupKeyframe = keyframes`
    0% {max-height: 0;}
  100% {max-height: 200px;}
`;

const PopupMessage: React.FC<{ message: string }> = (props) => {
  return (
    <div
      css={css`
        width: 100%;
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        display: ${props.message ? "block" : "none"};
        background: #111418;
        overflow: hidden;
        animation: ${popupKeyframe} 0.6s ease;
        transform-origin: center;
      `}
    >
      <div
        css={css`
          padding: 15px 0;
          color: #ffffff;
          text-align: center;
          font-size: 140%;
        `}
      >
        {props.message}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PairsProps> = async (context) => {
  const voices = loadSneeze();

  return {
    props: {
      voices,
    },
  };
};

export default Pairs;
