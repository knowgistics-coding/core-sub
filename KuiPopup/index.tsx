import * as React from "react";
import {
  Box,
  Button,
  DialogContent,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";
import { DialogStyled } from "./dialog.styles";
import { PopupReducer } from "./state";

const Enhance = {
  Title: styled(Typography)({
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  }),
  TextField: styled(TextField)({ marginTop: 16 }),
  ContentCenter: styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  }),
  Text: styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0, 1),
  })),
  Button: styled(Button)({}),
};
Enhance.Title.defaultProps = {
  variant: "h6",
};
Enhance.TextField.defaultProps = {
  autoFocus: true,
  fullWidth: true,
};
Enhance.Text.defaultProps = {
  variant: "body2",
  color: "textSecondary",
  textAlign: "center",
};
Enhance.Button.defaultProps = {
  fullWidth: true,
  size: "large",
  color: "info",
};

export const KuiPopup = () => {
  const { popup, dispatchPopup, t } = useCore();

  const handleChangeValue = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => dispatchPopup({ type: "value", value });
  const handleClose = () => {
    dispatchPopup({ type: "open", value: false });
    setTimeout(() => {
      dispatchPopup({ type: "value", value: "" });
    }, popup.timeout * 2);
  };
  const handleConfirm = () => {
    if (["confirm", "remove"].includes(popup.type)) {
      setTimeout(() => {
        popup.onConfirm();
      }, popup.timeout);
      handleClose();
    } else if (popup.type === "prompt") {
      setTimeout(() => {
        popup.onConfirm(popup.value);
      }, popup.timeout);
      handleClose();
    }
  };
  const handleAbort = () => {
    setTimeout(() => {
      popup.onAbort();
    }, popup.timeout);
    handleClose();
  };

  return (
    <DialogStyled open={popup.open} onClose={handleAbort}>
      <DialogContent>
        <Enhance.ContentCenter>
          {popup.icon && <PickIcon size="2x" icon={popup.icon} />}
          <Enhance.Title variant="h6" fontWeight={"bold"} sx={{ mt: 2, mb: 1 }}>
            {popup.title}
          </Enhance.Title>
          {popup.type === "prompt" ? (
            <Enhance.TextField
              label={popup.text}
              value={popup.value}
              onChange={handleChangeValue}
              onKeyDown={(e) => {
                if (e.key === "Enter" && popup.value) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
            />
          ) : (
            <Enhance.Text>{popup.text}</Enhance.Text>
          )}
        </Enhance.ContentCenter>
        <Stack spacing={0.5}>
          {((type?: PopupReducer["type"]) => {
            switch (type) {
              case "confirm":
                return (
                  <React.Fragment>
                    <Enhance.Button variant="contained" onClick={handleConfirm}>
                      {t("Confirm")}
                    </Enhance.Button>
                    <Enhance.Button onClick={handleAbort}>
                      {t("Cancel")}
                    </Enhance.Button>
                  </React.Fragment>
                );
              case "prompt":
                return (
                  <React.Fragment>
                    <Enhance.Button variant="contained" onClick={handleConfirm}>
                      {t("Confirm")}
                    </Enhance.Button>
                    <Enhance.Button onClick={handleAbort}>
                      {t("Cancel")}
                    </Enhance.Button>
                  </React.Fragment>
                );
              case "remove":
                return (
                  <React.Fragment>
                    <Enhance.Button
                      variant="contained"
                      onClick={handleConfirm}
                      color="error"
                    >
                      {t("Remove")}
                    </Enhance.Button>
                    <Enhance.Button onClick={handleAbort}>
                      {t("Cancel")}
                    </Enhance.Button>
                  </React.Fragment>
                );
              default:
                return (
                  <Enhance.Button onClick={handleAbort}>
                    {t("Close")}
                  </Enhance.Button>
                );
            }
          })(popup.type)}
        </Stack>
      </DialogContent>
    </DialogStyled>
  );
};
