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
  Grow,
} from "@mui/material";
import * as React from "react";
import { KuiButton } from "../KuiButton";
import { PickIcon, PickIconName, PickIconProps } from "../PickIcon";

export type FensterProps = {
  open: boolean;
  title: React.ReactNode;
  maxWidth?: Breakpoint;
  icon?: PickIconName;
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
    icon: Omit<PickIconProps, "icon">;
  };
};

export const Fenster = (props: FensterProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth || "sm"}
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Grow}
      {...props.componentProps?.root}
    >
      <DialogTitle {...props.componentProps?.title}>
        {props.icon && (
          <PickIcon
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
