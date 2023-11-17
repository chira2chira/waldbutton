import { css } from "@emotion/react";

export const stickyButton = css`
  position: sticky;
  bottom: 10px;
  text-align: right;
  margin-top: -10px;
  margin-right: 10px;
  margin-bottom: -40px;
  pointer-events: none;
  z-index: 1;

  & > * {
    pointer-events: auto;
  }

  @media (min-width: 64em) {
    margin-right: -50px;
  }
`;

export const stickyAprilFoolButton = css`
  position: sticky;
  bottom: 10px;
  text-align: left;
  margin-top: -10px;
  margin-left: 10px;
  margin-bottom: -40px;
  pointer-events: none;
  z-index: 1;

  & > * {
    pointer-events: auto;
  }

  @media (min-width: 64em) {
    margin-left: -125px;
  }
`;

export const voiceCard = css`
  position: relative;

  & + & {
    margin-top: 20px;
  }
`;

export const cardHead = css`
  display: flex;
  justify-content: space-between;
  /** sticky向けスタイル */
  position: sticky;
  top: 0;
  margin-top: -8px;
  padding-top: 8px;
  z-index: 1;
  background: inherit;
`;

export const socialBox = css`
  width: fit-content;

  & + & {
    margin-top: 5px;
  }
`;

export const socialLink = css`
  display: flex;
  gap: 5px;
`;

export const voiceList = css`
  margin: 1px; /* stickyヘッダーからはみ出し防止 */
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;
