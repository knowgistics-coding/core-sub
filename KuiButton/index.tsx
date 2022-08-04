import { Button, ButtonProps } from "@mui/material";

import { IconStyled } from "../IconStyled";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export interface KuiButtonProps extends ButtonProps {
  tx:
    | "add"
    | "bin"
    | "browse"
    | "cancel"
    | "clear"
    | "confirm"
    | "close"
    | "remove"
    | "save"
    | "signout";
  loading?: boolean;
  fontAwesomeIconProps?: Omit<FontAwesomeIconProps, "icon">;
}
export const KuiButton = ({
  tx,
  children,
  loading,
  fontAwesomeIconProps,
  ...props
}: KuiButtonProps) => {
  let txProps: ButtonProps = {};
  const { t } = useTranslation();

  switch (tx) {
    case "add":
      txProps = {
        variant: "outlined",
        startIcon: <IconStyled icon={["far", "plus"]} />,
        children: children || t("Create"),
        color: "info",
      };
      break;
    case "bin":
      txProps = {
        variant: "outlined",
        startIcon: <IconStyled icon={["far", "trash"]} />,
        children: children || t("Trash"),
      };
      break;
    case "browse":
      txProps = {
        variant: "outlined",
        startIcon: (
          <IconStyled icon={["far", "folder-open"]} {...fontAwesomeIconProps} />
        ),
        component: "span",
        children: children || t("Browse"),
        color: "neutral"
      } as any;
      break;
    case "cancel":
      txProps = {
        children: children || t("Cancel"),
        color: "neutral",
      };
      break;
    case "clear":
      txProps = {
        color: "error",
        children: children || t("Clear"),
      };
      break;
    case "confirm":
      txProps = {
        color: "info",
        children: children || t("Confirm"),
      };
      break;
    case "close":
      txProps = {
        children: children || t("Close"),
        color: "neutral",
      };
      break;
    case "remove":
      txProps = {
        startIcon: (
          <FontAwesomeIcon icon={["far", "trash"]} {...fontAwesomeIconProps} />
        ),
        color: "error",
        children: children || t("Remove"),
      };
      break;
    case "save":
      txProps = {
        startIcon: (
          <FontAwesomeIcon icon={["far", "save"]} {...fontAwesomeIconProps} />
        ),
        color: "success",
        children: children || t("Save"),
      };
      break;
    case "signout":
      txProps = {
        startIcon: (
          <FontAwesomeIcon
            icon={["far", "sign-out"]}
            {...fontAwesomeIconProps}
          />
        ),
        color: "error",
        children: children || t("Sign Out"),
      };
      break;
  }

  if (loading) {
    return (
      <Button
        {...txProps}
        {...props}
        startIcon={
          <IconStyled
            icon={["far", "spinner"]}
            pulse
            {...fontAwesomeIconProps}
          />
        }
        disabled
      >
        {t("Please Wait")}
      </Button>
    );
  } else {
    return <Button {...txProps} {...props} />;
  }
};
