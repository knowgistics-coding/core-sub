import * as React from "react";
import {
  Popup,
  PopupAlert,
  PopupCallbackData,
  PopupContext,
  PopupFunc,
  PopupPrompt,
  PopupState,
  PopupType,
} from "./context";
import {
  Box,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogStyled } from "./dialog.styles";
import { ButtonStyled } from "./button.styled";
import { PickIcon } from "../PickIcon";

const timeout: number = 250;

export type PopupTranslateKey = "confirm" | "remove" | "cancel" | "close";
export type PopupTranslate = Record<PopupTranslateKey, string>;

export const PopupProvider = ({
  trans,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { trans?: PopupTranslate }) => {
  const [state, setState] = React.useState<PopupState>({ open: false });
  const [value, setValue] = React.useState<string>("");

  const alert = React.useCallback(
    (options: PopupAlert) =>
      setState({ ...options, type: "alert", open: true }),
    []
  );
  const confirm = React.useCallback(
    (options: Popup) => setState({ ...options, type: "confirm", open: true }),
    []
  );
  const prompt = React.useCallback(
    ({ defaultValue, ...options }: PopupPrompt) => {
      setState({ ...options, type: "prompt", open: true });
      setValue(defaultValue || "");
    },
    []
  );
  const remove = React.useCallback(
    (options: Popup) => setState({ ...options, type: "remove", open: true }),
    []
  );

  const Popup: PopupFunc = { alert, confirm, prompt, remove };

  const PopupCallback = React.useCallback(
    (type: "alert" | "confirm" | "prompt" | "remove") =>
      (data: PopupCallbackData) => {
        switch (type) {
          case "alert":
            if (data.alert) {
              setState({ ...data.alert, type: "alert", open: true });
            }
            return;
          case "confirm":
            if (data.confirm) {
              setState({ ...data.confirm, type: "confirm", open: true });
            }
            return;
          case "prompt":
            if (data.prompt) {
              const { defaultValue, ...options } = data.prompt;
              setState({ ...options, type: "prompt", open: true });
              setValue(defaultValue || "");
            }
            return;
          case "remove":
            if (data.remove) {
              setState({ ...data.remove, type: "remove", open: true });
            }
            return;
          default:
            throw new Error("Invalid type");
        }
      },
    []
  );

  const handleChangeValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setValue(value);
  const handleConfirm = () => {
    if (["confirm", "remove"].includes(state?.type || "")) {
      setTimeout(() => {
        state?.onConfirm?.();
      }, timeout);
      handleClose();
    } else if (state.type === "prompt") {
      setTimeout(() => {
        state?.onConfirm?.(value);
      }, timeout);
      handleClose();
    }
  };
  const handleAbort = () => {
    setTimeout(() => {
      state?.onAbort?.();
    }, timeout);
    handleClose();
  };
  const handleClose = () => setState((s) => ({ ...s, open: false }));

  return (
    <PopupContext.Provider value={{ Popup, PopupCallback }}>
      <div id="popup-provider" {...props} />
      <DialogStyled open={state.open} onClose={handleAbort}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            {state.icon && (
              <PickIcon size="2x" icon={state.icon} />
            )}
            <Typography variant="h6" fontWeight={"bold"} sx={{ mt: 2, mb: 1 }}>
              {state.title}
            </Typography>
            {state.type === "prompt" ? (
              <TextField
                autoFocus
                label={state.text}
                fullWidth
                value={value}
                onChange={handleChangeValue}
                sx={{ mt: 2 }}
                onKeyDown={({ key }) =>
                  key === "Enter" && value && handleConfirm()
                }
              />
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
                sx={{ px: 1 }}
              >
                {state.text}
              </Typography>
            )}
          </Box>
          <Stack spacing={0.5}>
            {((type?: PopupType) => {
              switch (type) {
                case "confirm":
                  return (
                    <React.Fragment>
                      <ButtonStyled variant="contained" onClick={handleConfirm}>
                        {trans?.confirm || "Confirm"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                case "prompt":
                  return (
                    <React.Fragment>
                      <ButtonStyled variant="contained" onClick={handleConfirm}>
                        {trans?.confirm || "Confirm"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                case "remove":
                  return (
                    <React.Fragment>
                      <ButtonStyled
                        variant="contained"
                        onClick={handleConfirm}
                        color="error"
                      >
                        {trans?.remove || "Remove"}
                      </ButtonStyled>
                      <ButtonStyled onClick={handleAbort}>
                        {trans?.cancel || "Cancel"}
                      </ButtonStyled>
                    </React.Fragment>
                  );
                default:
                  return (
                    <ButtonStyled onClick={handleAbort}>
                      {trans?.close || "Close"}
                    </ButtonStyled>
                  );
              }
            })(state.type)}
          </Stack>
        </DialogContent>
      </DialogStyled>
    </PopupContext.Provider>
  );
};
