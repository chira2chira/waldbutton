import { getIronSession } from "iron-session";
import type { NextApiRequest, NextApiResponse } from "next";
import { SessionData, sessionOptions } from "../../../utils/session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ message: "不正なリクエスト" });
  }
  const { key } = req.body;
  if (!key) {
    return res.status(400).json({ message: "不正なリクエスト" });
  }

  try {
    const result = await fetch(`${process.env.BOT_ENDPOINT}/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BOT_API_KEY || "",
      },
      body: JSON.stringify({ key }),
    });

    const { id, message } = await result.json();
    if (result.ok) {
      const session = await getIronSession<SessionData>(
        req,
        res,
        sessionOptions
      );
      session.channelId = id;
      await session.save();
    }

    return res.send({
      success: result.ok,
      message,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Botとの通信に失敗しました。" });
  }
}
