import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useCore } from "../context";
import { PickIcon, PickIconName } from "../PickIcon";

const DialogStyled = styled(Dialog)({
  "& .MuiDialog-paper": { maxWidth: 360, borderRadius: "1.5rem" },
  "& .MuiDialogContent-root": {
    padding: "1.5rem 1rem 1rem",
  },
});

export type DialogPopupProps = {
  open: boolean;
  onClose: () => void;
  icon: PickIconName;
  title: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};
export const DialogPopup = (props: DialogPopupProps) => {
  const { t } = useCore();

  return (
    <DialogStyled fullWidth open={props.open} onClose={props.onClose}>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <PickIcon size="2x" icon={props.icon} />
            <Typography variant="h6" textAlign={"center"} fontWeight={"bold"}>
              {props.title}
            </Typography>
          </Stack>
          <Stack spacing={1}>{props.children}</Stack>
          <Stack spacing={1}>
            {props.actions}
            <Button color="neutral" size="large" onClick={props.onClose}>
              {t("Close")}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </DialogStyled>
  );
};
