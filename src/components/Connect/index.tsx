import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { ConnectContext } from "../../providers/ConnectProvider";
import { BottomToaster } from "../../utils/toast";
import { css } from "@emotion/react";
import { Button } from "@blueprintjs/core";

const Connect: React.FC = (props) => {
  const { query } = useRouter();
  const { connecting, disconnect } = useContext(ConnectContext);

  useEffect(() => {
    const { connectMessage } = query;
    if (connectMessage) {
      BottomToaster?.show({
        message: connectMessage,
        intent: connecting ? "success" : "danger",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {connecting && (
        <div
          css={css`
            display: inline-block;
          `}
        >
          <Button
            css={css`
              display: flex;
              padding: 0 10px;
              height: 3.5em;
              overflow: hidden;
              border: none;
              border-radius: 10px;
              background: #1c2127;
              box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
              align-items: center;
              cursor: pointer;
              transition: width 0.5s ease-in-out;
            `}
            icon={
              <img
                src="/static/svg/discord.svg"
                height="17"
                alt="Discordアイコン"
              />
            }
            intent="danger"
            onClick={disconnect}
          >
            Botとの接続を切る
          </Button>
        </div>
      )}
    </>
  );
};

export default Connect;
