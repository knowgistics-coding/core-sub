import { Button, ButtonProps } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PickIcon, PickIconProps } from "../PickIcon";

export interface KuiButtonProps extends ButtonProps {
  tx:
    | "add"
    | "bin"
    | "browse"
    | "cancel"
    | "clear"
    | "confirm"
    | "close"
    | "download"
    | "import"
    | "remove"
    | "save"
    | "setting"
    | "signout"
    | "upload";
  loading?: boolean;
  pickIconProps?: Omit<PickIconProps, "icon">;
}
export const KuiButton = ({
  tx,
  children,
  loading,
  pickIconProps,
  ...props
}: KuiButtonProps) => {
  let txProps: ButtonProps = {};
  const { t } = useTranslation();

  switch (tx) {
    case "add":
      txProps = {
        variant: "outlined",
        startIcon: <PickIcon icon={"plus"} />,
        children: children || t("Create"),
        color: "info",
      };
      break;
    case "bin":
      txProps = {
        variant: "outlined",
        startIcon: <PickIcon icon={"trash"} />,
        children: children || t("Trash"),
      };
      break;
    case "browse":
      txProps = {
        variant: "outlined",
        startIcon: <PickIcon icon={"folder-open"} {...pickIconProps} />,
        component: "span",
        children: children || t("Browse"),
        color: "neutral",
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
    case "download":
      txProps = {
        variant: "outlined",
        children: children || t("Download"),
        startIcon: <PickIcon icon={"download"} />,
        color: "neutral",
      };
      break;
    case "import":
      txProps = {
        variant: "outlined",
        children: children || t("Import"),
        startIcon: <PickIcon icon={"download"} />,
        color: "info",
      };
      break;
    case "remove":
      txProps = {
        startIcon: <PickIcon icon={"trash"} {...pickIconProps} />,
        color: "error",
        children: children || t("Remove"),
      };
      break;
    case "save":
      txProps = {
        startIcon: <PickIcon icon={"save"} {...pickIconProps} />,
        color: "success",
        children: children || t("Save"),
      };
      break;
    case "setting":
      txProps = {
        variant: "outlined",
        startIcon: <PickIcon icon={"cog"} {...pickIconProps} />,
        color: "neutral",
        children: children || t("Setting"),
      };
      break;
    case "signout":
      txProps = {
        startIcon: <PickIcon icon={"sign-out"} {...pickIconProps} />,
        color: "error",
        children: children || t("Sign Out"),
      };
      break;
    case "upload":
      txProps = {
        startIcon: <PickIcon icon={"upload"} />,
        variant: "outlined",
        children: children || t("Upload"),
      };
      break;
  }

  if (loading) {
    return (
      <Button
        {...txProps}
        {...props}
        startIcon={<PickIcon icon={"spinner"} pulse {...pickIconProps} />}
        disabled
      >
        {t("Please Wait")}
      </Button>
    );
  } else {
    return <Button {...txProps} {...props} />;
  }
};
