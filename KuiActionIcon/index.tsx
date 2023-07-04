import { IconButton, IconButtonProps } from "@mui/material";
import { PickIcon, PickIconProps } from "../PickIcon";
import { forwardRef } from "react";

const IconXS = (props: PickIconProps) => <PickIcon {...props} />;

export interface KuiActionIconProps extends IconButtonProps {
  tx:
    | "add"
    | "cancel"
    | "check"
    | "copy"
    | "edit"
    | "info"
    | "remove"
    | "restore"
    | "view";
}
export const KuiActionIcon = forwardRef<HTMLButtonElement, KuiActionIconProps>(
  ({ tx, ...props }, ref) => {
    let newProps = {};

    switch (tx) {
      case "add":
        newProps = {
          children: <IconXS icon={"plus"} />,
          color: "info",
          ...props,
        };
        break;
      case "cancel":
        newProps = {
          children: <IconXS icon={"xmark"} />,
          ...props,
        };
        break;
      case "check":
        newProps = {
          children: <IconXS icon={"check"} />,
          color: "primary",
          ...props,
        };
        break;
      case "copy":
        newProps = {
          children: <IconXS icon={"copy"} />,
          ...props,
        };
        break;
      case "edit":
        newProps = {
          children: <IconXS icon={"edit"} />,
          color: "warning",
          ...props,
        };
        break;
      case "info":
        newProps = {
          children: <IconXS icon={"info-circle"} />,
          ...props,
        };
        break;
      case "remove":
        newProps = {
          children: <IconXS icon={"trash"} />,
          color: "error",
          ...props,
        };
        break;
      case "restore":
        newProps = {
          children: <IconXS icon={"redo"} />,
          color: "neutral",
          ...props,
        };
        break;
      case "view":
        newProps = {
          children: <IconXS icon={"eye"} />,
          color: "neutral",
          ...props,
        };
        break;
      default:
        newProps = {
          ...props,
        };
        break;
    }

    return <IconButton ref={ref} size="small" {...newProps} />;
  }
);
