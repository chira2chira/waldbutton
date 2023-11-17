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
      part: ["snippet", "liveStreamingDetails"],
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
  }));
}
