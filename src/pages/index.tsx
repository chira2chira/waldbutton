import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Classes,
  Drawer,
  H5,
  InputGroup,
  Label,
  Tab,
  Tabs,
} from "@blueprintjs/core";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { forceCheck } from "react-lazyload";
import { css } from "@emotion/react";
import moji from "moji";
import * as styles from "../styles/Home.module";
import { loadAllVoice } from "../utils/yamlUtil";
import { fetchYoutubeInfo } from "../utils/youtube";
import { useVersionCheck } from "../hooks/useVersionCheck";
import Container from "../templates/Container";
import CommonMeta from "../components/CommonMeta";
import VolumeControl from "../components/VolumeControl";
import Tips from "../components/Tips";
import InviteBot from "../components/InviteBot";
import CategoryCard from "../components/CategoryCard";
import VideoCard from "../components/VideoCard";
import VideoInfo from "../components/VideoInfo";
import TweetButton from "../components/TweetButton";
import Favorite from "../components/Favorite";
import OpenFavoriteButton from "../components/OpenFavoriteButton";
import Connect from "../components/Connect";
import RandomVoiceButton from "../components/RandomVoiceButton";

export type VoiceCategory =
  | "greetings"
  | "reactions"
  | "se"
  | "dirties"
  | "sayings"
  | "memes"
  | "sensitive"
  | "common";

export type VoiceBase = {
  url: string;
  id: string;
  text: string;
};

export type VoiceInfo = VoiceBase & {
  kana: string;
  time: string;
  category: VoiceCategory;
  disabled?: boolean;
};

export type YouTubeInfo = {
  id: string;
  title: string;
  date: string;
  thumbnailUrl: string;
};

type DisplayMode = "category" | "video";

type HomeProps = {
  voiceInfo: VoiceInfo[];
  youtubeInfo: YouTubeInfo[];
};

const Home: NextPage<HomeProps> = (props) => {
  const [isPending, startTransition] = useTransition();
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [filteredVoiceInfo, setFilteredVoiceInfo] = useState<VoiceInfo[]>([]);
  const [currentVoice, setCurrentVioce] = useState<VoiceInfo & YouTubeInfo>();
  const [[openedList, openedIndex], setCurrentMeta] = useState<
    [VoiceInfo[], number]
  >([[], -1]);
  const [videoInfoOpen, setVideoInfoOpen] = useState(false);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [mode, setMode] = useState<DisplayMode>("category");
  const filterRef = useRef<HTMLInputElement>(null);
  const { query, replace } = useRouter();
  useVersionCheck();

  const updateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setIsFilterMode(value !== "");
    startTransition(() => {
      const filterd = props.voiceInfo
        .filter((x) => !x.disabled)
        .filter(filterList(value))
        .sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
      setFilteredVoiceInfo(filterd);
    });
  };

  const clearFilter = () => {
    setIsFilterMode(false);
    if (filterRef.current) filterRef.current.value = "";
    startTransition(() => {
      setFilteredVoiceInfo([]);
    });
  };

  const {
    vGreetings,
    vReactions,
    vSe,
    vDirties,
    vSayings,
    vMemes,
    vSensitive,
    vCommons,
  } = useMemo(() => {
    const enableVoice = props.voiceInfo.filter((x) => !x.disabled);
    return {
      vGreetings: enableVoice.filter((x) => x.category === "greetings"),
      vReactions: enableVoice.filter((x) => x.category === "reactions"),
      vSe: enableVoice.filter((x) => x.category === "se"),
      vDirties: enableVoice.filter((x) => x.category === "dirties"),
      vSayings: enableVoice.filter((x) => x.category === "sayings"),
      vMemes: enableVoice.filter((x) => x.category === "memes"),
      vSensitive: enableVoice.filter((x) => x.category === "sensitive"),
      vCommons: enableVoice.filter((x) => x.category === "common"),
    };
  }, [props.voiceInfo]);

  const getYouTubeInfo = useCallback(
    (id: string) => {
      const yt = props.youtubeInfo.find((x) => x.id === id);
      const title = yt?.title || "";
      const date = yt?.date || "";
      const thumbnailUrl = yt?.thumbnailUrl || "";
      return { id, title, date, thumbnailUrl };
    },
    [props.youtubeInfo]
  );

  useEffect(() => {
    // 動的な画面切換が行われた際LazyLoadの判定をする
    forceCheck();
  }, [isFilterMode, mode]);

  useEffect(() => {
    const { voice, id } = query;
    if (voice && id) {
      const targetVoice = props.voiceInfo.find(
        (x) => x.text === voice && x.id === id
      );
      if (targetVoice) {
        const ytInfo = getYouTubeInfo(targetVoice.id);
        setCurrentMeta([[], 0]);
        setCurrentVioce({ ...targetVoice, ...ytInfo });
        setVideoInfoOpen(true);
      } else {
        setCurrentMeta([[], 0]);
        setCurrentVioce(undefined);
        setVideoInfoOpen(true);
      }
    }
  }, [query, props, getYouTubeInfo]);

  const handleModeChange = useCallback((newMode: DisplayMode) => {
    setMode(newMode);
  }, []);

  const handleVideoOpen = useCallback(
    (voice: VoiceInfo, infoList: VoiceInfo[]) => {
      const index = infoList.findIndex((x) => x.url === voice.url);
      const ytInfo = getYouTubeInfo(voice.id);
      setCurrentMeta([infoList, index]);
      setCurrentVioce({ ...voice, ...ytInfo });
      setVideoInfoOpen(true);
    },
    [getYouTubeInfo]
  );

  const handleVideoOpenWithYouTube = useCallback(
    (voice: VoiceInfo, youtubeInfo: YouTubeInfo) => {
      const infoList = props.voiceInfo.filter(
        (x) => x.id === youtubeInfo.id && !x.disabled
      );
      const index = infoList.findIndex((x) => x.url === voice.url);
      setCurrentMeta([infoList, index]);
      setCurrentVioce({ ...voice, ...youtubeInfo });
      setVideoInfoOpen(true);
    },
    [props.voiceInfo]
  );

  const handleVoiceInfoOpen = useCallback(
    (infoList: VoiceInfo[]) => (voice: VoiceInfo) => {
      handleVideoOpen(voice, infoList);
    },
    [handleVideoOpen]
  );

  const handleCloseInfo = useCallback(() => {
    // 共有リンクからの場合クリアする
    if (query.voice) {
      replace("/", undefined, { shallow: true });
    }
    setVideoInfoOpen(false);
  }, [query, replace]);

  const handlePrev = useCallback(() => {
    const newIndex = openedIndex - 1;
    const voice = openedList[newIndex];
    const ytInfo = getYouTubeInfo(voice.id);
    setCurrentMeta([openedList, newIndex]);
    setCurrentVioce({ ...voice, ...ytInfo });
  }, [getYouTubeInfo, openedIndex, openedList]);

  const handleNext = useCallback(() => {
    const newIndex = openedIndex + 1;
    const voice = openedList[newIndex];
    const ytInfo = getYouTubeInfo(voice.id);
    setCurrentMeta([openedList, newIndex]);
    setCurrentVioce({ ...voice, ...ytInfo });
  }, [getYouTubeInfo, openedIndex, openedList]);

  return (
    <>
      <CommonMeta
        title="ワルトボタン"
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
          <div>
            <InviteBot />
          </div>
          <div>
            <Tips />
          </div>
          <TweetButton path="/" />
        </div>

        <div
          css={css`
            display: flex;
            gap: 20px;
            margin-bottom: 10px;

            @media (max-width: 420px) {
              width: 95vw;
              flex-direction: column;
            }
          `}
        >
          <Card
            css={css`
              flex-grow: 1;

              & h5:not(:first-child) {
                margin-top: 15px;
              }
            `}
          >
            <H5>About 逢魔牙ワルト</H5>

            <div>
              <div css={styles.socialBox}>
                <a
                  href="https://twitter.com/OumagaWald"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div css={styles.socialLink}>
                    <img
                      src="/static/svg/twitter.svg"
                      alt="Twitter"
                      width={20}
                      height={20}
                    />
                    <span>@OumagaWald</span>
                  </div>
                </a>
              </div>
              <div css={styles.socialBox}>
                <a
                  href="https://www.youtube.com/channel/UCh0vFb84fLnjUQkAE-hIR2w"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div css={styles.socialLink}>
                    <img
                      src="/static/svg/youtube.svg"
                      alt="YouTube"
                      width={20}
                      height={20}
                    />
                    <span>逢魔牙ワルト YouTubeチャンネル</span>
                  </div>
                </a>
              </div>
              <H5>これは何？</H5>
              <p>ワﾞルﾞー！</p>
              <p>
                情報提供は
                <a
                  href="https://forms.gle/mujoNpAqbsEjc67M9"
                  target="_blank"
                  rel="noreferrer"
                >
                  こちらのフォーム
                </a>
                にて随時受け付けてます。
              </p>
            </div>
          </Card>

          <Card
            css={css`
              width: 240px;
              @media (max-width: 420px) {
                width: 100%;
              }
            `}
          >
            <Label>
              音量
              <VolumeControl />
            </Label>

            <Label>
              検索
              <InputGroup
                inputRef={filterRef}
                leftIcon="filter"
                rightElement={
                  isFilterMode ? (
                    <Button icon="cross" minimal onClick={clearFilter} />
                  ) : undefined
                }
                onChange={updateFilter}
              ></InputGroup>
            </Label>

            <div>
              <RandomVoiceButton voiceInfo={props.voiceInfo} />
            </div>
          </Card>
        </div>

        <div className={isPending ? Classes.SKELETON : ""}>
          <div style={{ display: !isFilterMode ? undefined : "none" }}>
            <Tabs
              css={css`
                & .bp5-tab-list {
                  margin-left: 10px;
                }
                & .bp5-tab-panel {
                  margin-top: 8px;
                }
              `}
              onChange={handleModeChange}
              selectedTabId={mode}
              animate={false}
            >
              <Tab
                id="category"
                title="カテゴリー別"
                panel={
                  <React.Fragment>
                    <CategoryCard
                      title="あいさつ"
                      voiceInfo={vGreetings}
                      onVideoInfoOpen={handleVoiceInfoOpen(vGreetings)}
                    />
                    <CategoryCard
                      title="リアクション"
                      voiceInfo={vReactions}
                      onVideoInfoOpen={handleVoiceInfoOpen(vReactions)}
                    />
                    <CategoryCard
                      title="擬音系"
                      voiceInfo={vSe}
                      onVideoInfoOpen={handleVoiceInfoOpen(vSe)}
                    />
                    <CategoryCard
                      title="お口ワルト"
                      voiceInfo={vDirties}
                      onVideoInfoOpen={handleVoiceInfoOpen(vDirties)}
                    />
                    <CategoryCard
                      title="汎用"
                      hideDetails={true}
                      voiceInfo={vCommons}
                      onVideoInfoOpen={handleVoiceInfoOpen(vCommons)}
                    />
                    <CategoryCard
                      title="語録系"
                      voiceInfo={vSayings}
                      onVideoInfoOpen={handleVoiceInfoOpen(vSayings)}
                    />
                    <CategoryCard
                      title="ミーム・声マネ"
                      voiceInfo={vMemes}
                      onVideoInfoOpen={handleVoiceInfoOpen(vMemes)}
                    />
                    <CategoryCard
                      title="センシティブ"
                      voiceInfo={vSensitive}
                      onVideoInfoOpen={handleVoiceInfoOpen(vSensitive)}
                    />
                  </React.Fragment>
                }
              />
              <Tab
                id="video"
                title="動画別"
                panel={
                  <React.Fragment>
                    {props.youtubeInfo
                      .sort((a, b) => (a.date < b.date ? 1 : -1)) // 降順ソート
                      .map((ytInfo) => {
                        const targetVoiceList = props.voiceInfo.filter(
                          (x) =>
                            x.id === ytInfo.id &&
                            !x.disabled &&
                            x.category !== "common"
                        );

                        if (targetVoiceList.length === 0) return null;

                        return (
                          <VideoCard
                            key={ytInfo.id}
                            youtubeInfo={ytInfo}
                            voiceInfo={targetVoiceList}
                            onVideoInfoOpen={handleVideoOpenWithYouTube}
                          />
                        );
                      })}
                  </React.Fragment>
                }
              />
            </Tabs>
          </div>

          <div style={{ display: !isFilterMode ? "none" : undefined }}>
            <CategoryCard
              title="検索結果"
              voiceInfo={filteredVoiceInfo}
              onVideoInfoOpen={handleVoiceInfoOpen(filteredVoiceInfo)}
            />
          </div>
        </div>

        <div css={styles.stickyButton}>
          <div css={styles.stickyInner}>
            <OpenFavoriteButton
              drawerOpened={favoriteOpen}
              onClick={() => setFavoriteOpen(true)}
            />
            <Connect />
          </div>
        </div>

        <VideoInfo
          isOpen={videoInfoOpen}
          videoInfo={currentVoice}
          hasPrev={openedIndex > 0}
          hasNext={openedList.length > openedIndex + 1}
          onClose={handleCloseInfo}
          onPrev={handlePrev}
          onNext={handleNext}
        />

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

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const voiceInfo = loadAllVoice();
  const uniqueIds = Array.from(new Set(voiceInfo.map((x) => x.id)));
  const youtubeInfo = await fetchYoutubeInfo(uniqueIds);
  return {
    props: {
      voiceInfo,
      youtubeInfo,
    },
  };
};

export function filterList(filter: string) {
  const filterKana = moji(filter)
    .convert("HG", "KK")
    .toString()
    .toLowerCase()
    .trim();
  return function (item: VoiceInfo) {
    if (filter === "") {
      return [];
    }
    return item.text.includes(filter) || item.kana.includes(filterKana);
  };
}

export default Home;
