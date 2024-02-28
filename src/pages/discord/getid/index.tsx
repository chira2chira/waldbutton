import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getIronSession } from "iron-session";
import { useContext, useEffect } from "react";
import { ConnectContext } from "../../../providers/ConnectProvider";
import { SessionData, sessionOptions } from "../../../utils/session";
import CommonMeta from "../../../components/CommonMeta";

type GetIdProps = {
  success: boolean;
  message: string;
};

const GetId: NextPage<GetIdProps> = (props) => {
  const { push, asPath } = useRouter();
  const { connect } = useContext(ConnectContext);

  useEffect(() => {
    if (props.success) connect();
    push(`/?connectMessage=${encodeURI(props.message)}`, "/");
  }, [push, asPath, props, connect]);

  return (
    <>
      <CommonMeta title="ワルトボタン" cardType="summary" />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<GetIdProps> = async (
  context
) => {
  const key = context.query.key;

  try {
    const res = await fetch(`${process.env.BOT_ENDPOINT}/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BOT_API_KEY || "",
      },
      body: JSON.stringify({ key }),
    });

    const { id, message } = await res.json();
    if (res.ok) {
      const session = await getIronSession<SessionData>(
        context.req,
        context.res,
        sessionOptions
      );
      session.channelId = id;
      await session.save();
    }

    return {
      props: {
        success: res.ok,
        message,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        success: false,
        message: "Botとの通信に失敗しました。",
      },
    };
  }
};

export default GetId;
