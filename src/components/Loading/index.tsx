import React from "react";
import { css, jsx, keyframes } from "@emotion/react";

// from: https://codepen.io/jonginwon/pen/emfFD

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
}`;

const style = css`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #394b59;
  border-radius: 50%;

  animation: ${spin} 0.75s infinite linear;

  &:before,
  &:after {
    left: -2px;
    top: -2px;
    display: none;
    position: absolute;
    content: "";
    width: inherit;
    height: inherit;
    border: inherit;
    border-radius: inherit;
  }

  &,
  &:before {
    display: inline-block;
    border-color: transparent;
    border-top-color: #394b59;
  }
  &:after {
    animation: ${spin} 1.5s infinite ease;
  }

  .bp4-dark & {
    border: 2px solid #a7b6c2;
  }
  .bp4-dark &:before {
    border-top-color: #394b59;
  }
`;

const Loading: React.VFC = () => {
  return <div css={style} />;
};

export default Loading;
