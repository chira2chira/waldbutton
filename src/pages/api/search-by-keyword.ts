import type { NextApiRequest, NextApiResponse } from "next";
import { loadAllVoice } from "../../utils/yamlUtil";
import { filterList } from "..";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const keyword = req.query.keyword;
    if (typeof keyword !== "string" || keyword.trim() === "")
      return res.json({ items: [] });

    const voiceInfo = loadAllVoice();
    const filterd = voiceInfo
      .filter((x) => !x.disabled)
      .filter(filterList(keyword))
      .sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
    return res.json({
      items: filterd.map((x) => ({
        text: x.text,
        url: x.url,
      })),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error revalidating");
  }
}
