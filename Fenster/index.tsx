import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from "@mui/material";
import * as React from "react";
import { KuiButton } from "../KuiButton";

export type FensterProps = {
  open: boolean;
  title: React.ReactNode;
  maxWidth?: Breakpoint;
  icon?: IconProp;
  onClose?: (event?: {}, reason?: "backdropClick" | "escapeKeyDown") => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  componentProps?: {
    root: Omit<
      DialogProps,
      "children" | "fullWidth" | "maxWidth" | "open" | "onClose"
    >;
    title: Omit<DialogTitleProps, "children">;
    content: Omit<DialogContentProps, "children">;
    actions: Omit<DialogActionsProps, "children">;
    icon: Omit<FontAwesomeIconProps, "icon">;
  };
};

export const Fenster = (props: FensterProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth || "sm"}
      open={props.open}
      onClose={props.onClose}
      {...props.componentProps?.root}
    >
      <DialogTitle {...props.componentProps?.title}>
        {props.icon && (
          <FontAwesomeIcon
            icon={props.icon}
            style={{ marginRight: "1ch" }}
            {...props.componentProps?.icon}
          />
        )}
        {props.title}
      </DialogTitle>
      <DialogContent {...props.componentProps?.content}>
        {props.children}
      </DialogContent>
      <DialogActions {...props.componentProps?.actions}>
        {props.actions}
        {props.onClose && <KuiButton tx="close" onClick={props.onClose} />}
      </DialogActions>
    </Dialog>
  );
};
