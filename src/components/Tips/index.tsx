import { Button, Classes, Dialog, H5, Tabs, Tab } from "@blueprintjs/core";
import { css } from "@emotion/react";
import React, { useState } from "react";

const Tips: React.VFC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showTabId, setShowTabId] = useState("ios");

  const handleUsefulLink = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleTabChange = (tabId: string) => {
    setShowTabId(tabId);
  };

  return (
    <div
      css={css`
        @media (display-mode: standalone) {
          display: none;
        }
      `}
    >
      <a onClick={handleUsefulLink}>便利な使い方</a>

      <Dialog
        isOpen={modalOpen}
        onClose={handleClose}
        icon="info-sign"
        title="便利な使い方"
      >
        <div className={Classes.DIALOG_BODY}>
          <H5>アプリ化</H5>
          <p>
            ブラウザを立ち上げなくてもアプリのようにワルトボタンを利用できます。
          </p>
          <Tabs
            id="HowToAddApps"
            onChange={handleTabChange}
            selectedTabId={showTabId}
          >
            <Tab
              id="ios"
              title="iPhone/iPad"
              panel={
                <p>
                  <span>
                    Safariから共有ボタンをタップし、「ホーム画面に追加」をタップします。
                  </span>
                  <img
                    style={{ width: "100%", marginTop: "10px" }}
                    src="/static/image/pwa-ios.png"
                    alt="ホーム画面に追加する手順"
                    loading="lazy"
                  />
                </p>
              }
            />
            <Tab
              id="android"
              title="Android"
              panel={
                <p>
                  <span>
                    Chromeから2回以上訪問すると画面下部に案内が出るのでタップします。
                  </span>
                  <img
                    style={{ width: "100%", marginTop: "10px" }}
                    src="/static/image/pwa-android.png"
                    alt="ホーム画面に追加する手順"
                    loading="lazy"
                  />
                </p>
              }
            />
          </Tabs>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={handleClose}>閉じる</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Tips;
