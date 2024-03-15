import type { NextApiRequest, NextApiResponse } from "next";
import { loadAllVoice } from "../../utils/yamlUtil";
import { VoiceInfo } from "..";

const MAX_COUNT = 25;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let count = Number(req.query.count) || MAX_COUNT;
    count = MAX_COUNT < count ? MAX_COUNT : count;

    const voiceInfo = loadAllVoice();
    const enableVoice = voiceInfo.filter((x) => !x.disabled);

    const list: VoiceInfo[] = [];
    while (list.length < count) {
      const choice =
        enableVoice[Math.floor(Math.random() * enableVoice.length)];
      if (list.find((x) => x.url === choice.url)) continue;
      list.push(choice);
    }
    console.log(list);

    return res.json({
      items: list.map((x) => ({
        text: x.text,
        url: x.url,
      })),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
}
