import {
  Breakpoint,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grow,
} from "@mui/material";
import * as React from "react";
import { KuiButton } from "../KuiButton";

export type DialogCompactProps = {
  open: boolean;
  maxWidth?: Breakpoint | false;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  componentProps?: {
    dialog: Omit<DialogProps, "maxWidth" | "children">;
  };
};

export const DialogCompact = (props: DialogCompactProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth || "xs"}
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Grow}
      {...props.componentProps?.dialog}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.children}</DialogContent>
      <DialogActions>
        {props.actions}
        <KuiButton tx="close" onClick={props.onClose} />
      </DialogActions>
    </Dialog>
  );
};