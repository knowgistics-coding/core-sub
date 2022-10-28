import {
  Box,
  Breakpoint,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  Grow,
  styled,
  Typography,
} from "@mui/material";
import * as React from "react";
import { KuiButton } from "../KuiButton";
import { PickIcon, PickIconName } from "../PickIcon";

const DialogStyled = styled(Dialog)({
  "& .MuiPaper-root:not(.MuiDialog-paperFullScreen)": {
    borderRadius: 24,
  },
});
DialogStyled.defaultProps = {
  TransitionComponent: Grow,
};

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(3, 3, 2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
}));
const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(1) + "!important",
}));

const TitleStyled = styled(Box)({
  display: "flex",
  justifyContent: "center",
  width: "100%",
});

export type DialogCompactProps = {
  open: boolean;
  maxWidth?: Breakpoint | false;
  icon?: PickIconName;

  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  componentProps?: {
    dialog?: Omit<DialogProps, "open" | "maxWidth" | "children">;
    dialogContent?: Omit<DialogContentProps, "children">;
    dialogActions?: Omit<DialogActionsProps, "children">;
  };

  hideCloseButton?: boolean;
};

export const DialogCompact = (props: DialogCompactProps) => {
  return (
    <DialogStyled
      fullWidth
      maxWidth={props.maxWidth || "xs"}
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Grow}
      {...props.componentProps?.dialog}
    >
      <DialogTitleStyled>
        {props.icon && (
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            <PickIcon icon={props.icon} />
          </Typography>
        )}
        <TitleStyled>{props.title}</TitleStyled>
      </DialogTitleStyled>
      <DialogContentStyled {...props.componentProps?.dialogContent}>
        {props.children}
      </DialogContentStyled>
      <DialogActions {...props.componentProps?.dialogActions}>
        {props.actions}
        {Boolean(props.hideCloseButton) === false && (
          <KuiButton tx="close" onClick={props.onClose} />
        )}
      </DialogActions>
    </DialogStyled>
  );
};
