import { Slider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCore } from "../../context";
import { DialogCompact } from "../../DialogCompact";
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
    <DialogCompact
      open={open}
      onClose={onClose}
      title={t("Spacing")}
      icon="arrows-up-down"
      actions={
        <KuiButton
          tx="confirm"
          disabled={!onChange}
          onClick={() => onChange?.(value.top, value.bottom)}
        />
      }
    >
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
    </DialogCompact>
  );
};
