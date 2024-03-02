import { getIronSession } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";
import { SessionData, sessionOptions } from "../../../utils/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "不正なリクエスト" });
  }
  try {
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    const { url } = req.body;
    if (!session.channelId || !url) {
      return res.status(400).json({ message: "不正なリクエスト" });
    }

    const result = await fetch(`${process.env.BOT_ENDPOINT}/play`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BOT_API_KEY || "",
      },
      body: JSON.stringify({
        url,
        channel: session.channelId,
        clientIp: requestIp.getClientIp(req),
      }),
    });

    if (result.ok) {
      res.status(200).send({});
    } else {
      const { message } = await result.json();
      res.status(400).send({ message });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "通信に失敗しました。" });
  }
}
