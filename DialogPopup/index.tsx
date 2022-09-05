import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const DialogStyled = styled(Dialog)({
  "& .MuiDialog-paper": { maxWidth: 360, borderRadius: "1.5rem" },
  "& .MuiDialogContent-root": {
    padding: "1.5rem 1rem 1rem",
  },
});

export type DialogPopupProps = {
  open: boolean;
  onClose: () => void;
  icon: IconName;
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
            <FontAwesomeIcon size="2x" icon={["far", props.icon]} />
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
