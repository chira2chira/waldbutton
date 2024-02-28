import type { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_SECRET as string,
  cookieName: "next-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export type SessionData = {
  channelId: string;
};
