import { Card, Classes, Colors, Drawer, H2 } from "@blueprintjs/core";
import { css } from "@emotion/react";
import dayjs from "dayjs";
import { GetStaticProps, NextPage } from "next";
import React, { useState } from "react";
import { VoiceInfo } from ".";
import CommonMeta from "../components/CommonMeta";
import Favorite from "../components/Favorite";
import OpenFavoriteButton from "../components/OpenFavoriteButton";
import SimpleVoiceButton from "../components/SimpleVoiceButton";
import TweetButton from "../components/TweetButton";
import Container from "../templates/Container";
import * as styles from "../styles/Home.module";
import { query1week } from "../utils/bigQuery";
import { loadAllVoice } from "../utils/yamlUtil";

export type RankingItem = {
  id: string | null;
  text: string;
  count: number;
};

type RankingProps = {
  updateDate: string;
  ranking: RankingItem[];
  voiceInfo: VoiceInfo[];
};

const Ranking: NextPage<RankingProps> = (props) => {
  const [favoriteOpen, setFavoriteOpen] = useState(false);

  return (
    <>
      <CommonMeta
        title="ランキング - ワルトボタン"
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
          <TweetButton path="/ranking" />
        </div>

        <Card>
          <H2>ランキング</H2>
          <p>直近1週間の再生数ランキング</p>
          <div>
            <RankingList voiceInfo={props.voiceInfo} ranking={props.ranking} />
          </div>
          <div
            css={css`
              text-align: right;
              color: #5c7080;
            `}
          >
            {dayjs(props.updateDate).format("YYYY/M/D")}
          </div>
        </Card>

        <div css={styles.stickyButton}>
          <OpenFavoriteButton
            drawerOpened={favoriteOpen}
            onClick={() => setFavoriteOpen(true)}
          />
        </div>

        <Drawer
          isOpen={favoriteOpen}
          onClose={() => setFavoriteOpen(false)}
          title="お気に入り"
        >
          <div className={Classes.DRAWER_BODY}>
            <Favorite
              voiceInfo={props.voiceInfo}
              onClose={() => setFavoriteOpen(false)}
            />
          </div>
        </Drawer>
      </Container>
    </>
  );
};

type RankingListProps = {
  voiceInfo: VoiceInfo[];
  ranking: RankingItem[];
};

const RankingList: React.FC<RankingListProps> = (props) => {
  const rank1Count = props.ranking[0]?.count || 0;
  let prevCount = rank1Count + 1;
  let prevRank = 0;

  return (
    <>
      {props.ranking.map((x, i) => {
        const voice = props.voiceInfo.filter(
          (v) => v.id === x.id && v.text === x.text
        )[0];
        const sameRank = x.count === prevCount;
        const rank = sameRank ? prevRank : prevRank + 1;
        prevCount = x.count;
        prevRank = rank;
        return (
          <div
            key={x.text}
            css={css`
              position: relative;

              & > button {
                text-shadow: 1px 1px 3px #ffffff;
              }
              .bp4-dark & > button {
                text-shadow: 1px 1px 2px #494949;
              }
            `}
          >
            <div
              css={css`
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: ${(x.count / rank1Count) * 100 * 0.8}%;
                padding-right: 5px;
                border-width: 1px;
                border-style: solid;
                border-image: linear-gradient(to left, #f8eabb, white 40%) 1;
                background: linear-gradient(to left, #fdf9e7, white 30%);

                .bp4-dark & {
                  border-image: linear-gradient(
                      to left,
                      #f8eabb,
                      ${Colors.DARK_GRAY3} 40%
                    )
                    1;
                  background: linear-gradient(
                    to left,
                    #202b33,
                    ${Colors.DARK_GRAY3} 30%
                  );
                }
              `}
            >
              {!sameRank && rank < 4 && (
                <img
                  src={`/static/svg/rank${rank}.svg`}
                  alt={`#${rank}`}
                  width={22}
                  height={22}
                />
              )}
            </div>
            <SimpleVoiceButton key={voice.url} voice={voice} />
          </div>
        );
      })}
    </>
  );
};

export const getStaticProps: GetStaticProps<RankingProps> = async (context) => {
  // BigQueryはJSTでテーブルが作られている
  const yesterday = dayjs().tz("Asia/Tokyo").add(-1, "day");
  const ranking = await query1week(yesterday);
  const voiceInfo = loadAllVoice();

  // VercelのServerless Functionsでファイルが見つからずエラーになる対策
  // https://github.com/vercel/next.js/discussions/32236#discussioncomment-3029649
  const path = require("path");
  path.join(process.cwd(), "assets");

  return {
    props: {
      updateDate: dayjs().toISOString(),
      ranking,
      voiceInfo,
    },
  };
};

export default Ranking;
