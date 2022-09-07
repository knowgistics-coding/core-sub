import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Breakpoint,
  Dialog,
  DialogActions,
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
  icon?: IconName;
  title?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  componentProps?: {
    dialog?: Omit<DialogProps, "open" | "maxWidth" | "children">;
    dialogContent?: Omit<DialogContentProps, "children">;
  };
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
            <FontAwesomeIcon icon={["far", props.icon as IconName]} />
          </Typography>
        )}
        <TitleStyled>{props.title}</TitleStyled>
      </DialogTitleStyled>
      <DialogContentStyled {...props.componentProps?.dialogContent}>
        {props.children}
      </DialogContentStyled>
      <DialogActions>
        {props.actions}
        <KuiButton tx="close" onClick={props.onClose} />
      </DialogActions>
    </DialogStyled>
  );
};
