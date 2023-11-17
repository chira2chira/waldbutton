import { Toaster } from "@blueprintjs/core";

export const BottomToaster =
  typeof document !== "undefined" // SSRでは使えない
    ? Toaster.create({ position: "bottom" })
    : null;
