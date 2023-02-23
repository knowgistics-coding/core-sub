import * as React from "react";
import {
  Popup,
  PopupAlert,
  PopupCallbackData,
  PopupContext,
  PopupFunc,
  PopupPrompt,
} from "./context";
import { useCore } from "../context";

// const timeout: number = 250;

export type PopupTranslateKey = "confirm" | "remove" | "cancel" | "close";
export type PopupTranslate = Record<PopupTranslateKey, string>;

export const PopupProvider = ({
  trans,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { trans?: PopupTranslate }) => {
  const { dispatchPopup } = useCore();

  const alert = React.useCallback(
    (options: PopupAlert) => {
      dispatchPopup({ type: "set", alerttype: "alert", value: options });
    },
    [dispatchPopup]
  );
  const confirm = React.useCallback(
    (options: Popup) => {
      dispatchPopup({ type: "set", alerttype: "confirm", value: options });
    },
    [dispatchPopup]
  );
  const prompt = React.useCallback(
    ({ defaultValue, ...options }: PopupPrompt) => {
      dispatchPopup({
        type: "set",
        alerttype: "prompt",
        value: { value: defaultValue || "", ...options },
      });
    },
    [dispatchPopup]
  );
  const remove = React.useCallback(
    (options: Popup) => {
      dispatchPopup({ type: "set", alerttype: "remove", value: options });
    },
    [dispatchPopup]
  );

  const Popup: PopupFunc = { alert, confirm, prompt, remove };

  const PopupCallback = React.useCallback(
    (type: "alert" | "confirm" | "prompt" | "remove") =>
      (data: PopupCallbackData) => {
        switch (type) {
          case "alert":
            if (data.alert) {
              dispatchPopup({
                type: "set",
                alerttype: "alert",
                value: data.alert,
              });
            }
            return;
          case "confirm":
            if (data.confirm) {
              dispatchPopup({
                type: "set",
                alerttype: "confirm",
                value: data.confirm,
              });
            }
            return;
          case "prompt":
            if (data.prompt) {
              dispatchPopup({
                type: "set",
                alerttype: "prompt",
                value: {
                  value: data.prompt.defaultValue || "",
                  ...data.prompt,
                },
              });
            }
            return;
          case "remove":
            if (data.remove) {
              dispatchPopup({
                type: "set",
                alerttype: "remove",
                value: data.remove,
              });
            }
            return;
          default:
            throw new Error("Invalid type");
        }
      },
    [dispatchPopup]
  );

  return (
    <PopupContext.Provider value={{ Popup, PopupCallback }}>
      <div id="popup-provider" {...props} />
    </PopupContext.Provider>
  );
};
