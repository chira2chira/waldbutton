import { OverlayToaster } from "@blueprintjs/core";

export const BottomToaster =
  typeof document !== "undefined" // SSRでは使えない
    ? OverlayToaster.create({ position: "bottom" })
    : null;
