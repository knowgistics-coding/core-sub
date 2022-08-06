import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useCore } from "components/core-sub/context";
import { Fragment, useEffect, useState } from "react";
import { KuiButton } from "../../KuiButton";

interface PanelSpacingProps {
  open: boolean;
  onClose: () => void;
  value?: {
    top: number;
    bottom: number;
  };
  onChange?: (top: number, bottom: number) => void;
}
export const PanelSpacing = ({
  open,
  onClose,
  value: defaultValue,
  onChange,
}: PanelSpacingProps) => {
  const { t } = useCore();
  const [value, setValue] = useState<{ top: number; bottom: number }>({
    top: 0,
    bottom: 0,
  });

  const handleChangeValue =
    (key: "top" | "bottom") => (_e: any, value: number | number[]) =>
      setValue((v) => ({ ...v, [key]: value }));

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Fragment>
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <DialogTitle>{t("Spacing")}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>{t("Top")}</Typography>
          <Stack spacing={2} direction="row" alignItems="center">
            <Slider
              value={value.top}
              onChange={handleChangeValue("top")}
              min={0}
              max={20}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="textSecondary">
              {value.top}
            </Typography>
          </Stack>
          <Typography>{t("Bottom")}</Typography>
          <Stack spacing={2} direction="row" alignItems="center">
            <Slider
              value={value.bottom}
              onChange={handleChangeValue("bottom")}
              min={0}
              max={20}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption" color="textSecondary">
              {value.bottom}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <KuiButton
            tx="confirm"
            disabled={!onChange}
            onClick={() => onChange?.(value.top, value.bottom)}
          />
          <KuiButton tx="close" onClick={onClose} />
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
