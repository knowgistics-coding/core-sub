import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps } from "@mui/material";

const IconXS = (props: FontAwesomeIconProps) => <FontAwesomeIcon {...props} />;

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
export const KuiActionIcon = ({ tx, ...props }: KuiActionIconProps) => {
  let newProps = {};

  switch (tx) {
    case "add":
      newProps = {
        children: <IconXS icon={["far", "plus"]} />,
        color: "info",
        ...props,
      };
      break;
    case "cancel":
      newProps = {
        children: <IconXS icon={["far", "xmark"]} />,
        ...props,
      };
      break;
    case "check":
      newProps = {
        children: <IconXS icon={["far", "check"]} />,
        color: "primary",
        ...props,
      };
      break;
    case "copy":
      newProps = {
        children: <IconXS icon={["far", "copy"]} />,
        ...props,
      };
      break;
    case "edit":
      newProps = {
        children: <IconXS icon={["far", "edit"]} />,
        color: "warning",
        ...props,
      };
      break;
    case "info":
      newProps = {
        children: <IconXS icon={["far", "info-circle"]} />,
        ...props,
      };
      break;
    case "remove":
      newProps = {
        children: <IconXS icon={["far", "trash"]} />,
        color: "error",
        ...props,
      };
      break;
    case "restore":
      newProps = {
        children: <IconXS icon={["far", "redo"]} />,
        color: "neutral",
        ...props,
      };
      break;
    case "view":
      newProps = {
        children: <IconXS icon={["far", "eye"]} />,
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

  return <IconButton size="small" {...newProps} />;
};
