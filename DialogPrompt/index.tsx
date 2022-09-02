import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grow,
  TextField,
} from "@mui/material";
import React, {
  cloneElement,
  forwardRef,
  Fragment,
  useEffect,
  useState,
} from "react";
import { useCore } from "../context";
import { KuiButton } from "../KuiButton";

export interface DialogPromptProps {
  children?: React.ReactElement;
  value?: string;
  onConfirm: (value: string) => void;
  clearAfterConfirm?: boolean;
  title: React.ReactNode;
  label?: React.ReactNode;
  open?: boolean;
  onAbort?: () => void;
  onClose?: () => void;
}
export const DialogPrompt = forwardRef<HTMLInputElement, DialogPromptProps>(
  ({ value, onConfirm, open: dfOpen, ...props }, ref) => {
    const { t } = useCore();
    const [open, setOpen] = useState(false);
    const [v, setV] = useState("");
    const isComplete = Boolean(v && v !== value);

    const handleOpen = (open: boolean) => () => {
      setOpen(open);
      if (open === false) {
        props.onAbort?.();
        props.onClose?.();
      }
    };
    const handleChange = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => setV(value);
    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm(v);
        setOpen(false);
        props.onClose?.();
        if (props.clearAfterConfirm) {
          setV("");
        }
      }
    };

    useEffect(() => {
      if (value) {
        setV(value);
      }
    }, [value]);

    useEffect(() => {
      if (typeof dfOpen === "boolean") {
        setOpen(dfOpen);
      }
    }, [dfOpen]);

    return (
      <Fragment>
        {props.children &&
          cloneElement(props.children, {
            onClick: handleOpen(true),
          })}
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={handleOpen(false)}
          TransitionComponent={Grow}
          disableRestoreFocus
        >
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent>
            <Box pt={1} />
            <TextField
              fullWidth
              variant="outlined"
              label={props.label || "Input"}
              value={v || ""}
              onChange={handleChange}
              inputRef={ref}
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              disabled={!isComplete}
              onClick={handleConfirm}
            >
              {t("Confirm")}
            </Button>
            <KuiButton tx="close" onClick={handleOpen(false)} />
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
);
