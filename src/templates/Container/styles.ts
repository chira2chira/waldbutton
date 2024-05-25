import { css } from "@emotion/react";

export const container = css`
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f8fa;

  .bp5-dark & {
    background: #252a31;
  }
`;

export const header = css`
  width: 100%;
  padding: 8px 20px 10px;
  background: #182026;
  box-shadow: 0px 0px 3px 0px;

  .bp5-dark & {
    box-shadow: 0px 0px 3px 0px #182026;
  }

  @media (max-width: 440px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export const headerContainer = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: auto;
  width: 100%;
  max-width: 68em;

  & a {
    display: flex;
  }
`;

export const title = css`
  margin: 0;
  font-size: 30px !important;
  font-family: "Yusei Magic", sans-serif;
  font-weight: normal;
  color: #ffffff;

  &:before {
    content: "";
    display: inline-block;
    margin-right: 5px;
    width: 40px;
    height: 40px;
    background-image: url(/static/svg/button.svg);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    vertical-align: top;
  }

  /** 古いデバイス向け */
  @media (max-width: 390px) {
    font-size: 24px !important;
  }
  @media (max-width: 375px) {
    font-size: 22px !important;
  }
`;

export const headerApp = css`
  display: flex;
  align-items: flex-end;
  gap: 5px;
  font-size: 120%;
  color: white !important; /* ダークモードの優先度に勝つ */

  &:hover {
    color: white;
  }

  @media (max-width: 440px) {
    flex-direction: column;
    align-items: center;
    gap: 1px;
    font-size: 80%;

    & > img {
      height: 25px;
      width: 25px;
    }
  }
`;

export const main = css`
  width: 100%;
  max-width: 64em;
  padding: 5px 5px 20px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    width: 100%;
  }
`;

export const footer = css`
  width: 100%;
  min-height: 60px;
  padding: 20px 10px;
  border-top: 1px solid #e1e8ed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  z-index: 0;

  & > div + div {
    margin-top: 5px;
  }

  .bp5-dark & {
    border-top: 1px solid #5c7080;
    background: #182026;
  }
`;
