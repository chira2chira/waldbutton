import { google, youtube_v3 } from "googleapis";
import { YouTubeInfo } from "../pages";

export async function fetchYoutubeInfo(ids: string[]): Promise<YouTubeInfo[]> {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_API_KEY,
  });

  const MAX_RESULTS = 50;
  let items: youtube_v3.Schema$Video[] = [];

  // YouTube Data APIは50件ずつしか取得できない
  for (let i = 0; i < ids.length / MAX_RESULTS; i++) {
    const params: youtube_v3.Params$Resource$Videos$List = {
      part: ["snippet", "liveStreamingDetails", "contentDetails"],
      id: ids.slice(i * MAX_RESULTS, i * MAX_RESULTS + MAX_RESULTS),
    };
    const res = await youtube.videos.list(params);

    if (!res.data.items) {
      return [];
    }

    items = [...items, ...res.data.items];
  }

  return items.map((x) => ({
    id: x.id || "",
    title: x.snippet?.title || "",
    date:
      x.liveStreamingDetails?.actualStartTime || x.snippet?.publishedAt || "",
    thumbnailUrl: x.snippet?.thumbnails?.medium?.url || "",
    duration: convertDuration(x.contentDetails?.duration),
  }));
}

function convertDuration(duration: string | undefined | null) {
  if (!duration) return "";

  // PT#H#M#S もしくは PT#M#S
  const ma = duration.match(/\d+[HMS]/g);
  if (ma === null) return "";

  const result: string[] = [];
  let over1Hour = false;
  ma.forEach((x, i) => {
    const num = x.substring(0, x.length - 1);
    if (x.endsWith("H")) {
      result.push(num);
      over1Hour = true;
    } else if (x.endsWith("M")) {
      if (i === 0) {
        result.push(num);
      } else {
        result.push(num.padStart(2, "0"));
      }
    } else if (x.endsWith("S")) {
      if (over1Hour && i === 1) {
        // M が 0
        result.push("00");
      }
      result.push(num.padStart(2, "0"));
    }
  });
  if (
    (over1Hour && result.length === 2) ||
    (!over1Hour && result.length === 1)
  ) {
    // S が 0
    result.push("00");
  } else if (over1Hour && result.length === 1) {
    // M と S が 0
    result.push("00");
    result.push("00");
  }
  return result.join(":");
}
