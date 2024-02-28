import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CommonMeta from "../../../components/CommonMeta";

const Connect: NextPage = () => {
  const { query, replace, asPath } = useRouter();

  useEffect(() => {
    replace(`/discord/getid?key=${query.key}`);
  }, [replace, asPath, query]);

  return (
    <>
      <CommonMeta
        title="ワルトボタンと接続する"
        description="※このリンクは1回のみ有効"
        cardType="summary"
      />
    </>
  );
};

export default Connect;
