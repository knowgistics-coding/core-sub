import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCore } from "components/core-sub/context";
import { Fenster } from "components/core-sub/Fenster";
import { KuiButton } from "components/core-sub/KuiButton";
import { ChangeEvent, useEffect, useState } from "react";
import update from "react-addons-update";
import { usePE } from "../context";
import { useDialog } from "../dialog.manager";

const deciFixed = (value: number): string => {
  return (Math.round(value * 10000) / 10000).toString();
};

const ratios: {
  label: string;
  value: string;
}[] = [
  { label: "1:1", value: "1" },
  { label: "16:9", value: deciFixed(16 / 9) },
  { label: "9:16", value: deciFixed(9 / 16) },
  { label: "4:3", value: deciFixed(4 / 3) },
  { label: "3:4", value: deciFixed(3 / 4) },
  { label: "3:2", value: deciFixed(3 / 2) },
  { label: "2:3", value: deciFixed(2 / 3) },
];

export const DialogImageRatio = () => {
  const { t } = useCore();
  const { isOpen, setOpen, key } = useDialog();
  const {
    data: { contents },
    setData,
  } = usePE();
  const [value, setValue] = useState<string>("1");
  const content = contents?.find((c) => c.key === key);
  const open = Boolean(isOpen("image_ratio") && content);

  const getValue = (): string => {
    return ratios.findIndex((item) => item.value === value) > -1 ? value : "";
  };
  const handleChangeValue = (value: string) => setValue(value);
  const handleChangeSelect = ({ target: { value } }: SelectChangeEvent) => {
    handleChangeValue(value);
  };
  const handleChangeInput = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    handleChangeValue(value);
  };
  const handleConfirm = () => {
    const index = contents?.findIndex((c) => c.key === key) || -1;
    if (index > -1) {
      setData((d) =>
        update(d, {
          contents: {
            [index]: { image: { ratio: { $set: parseFloat(value) } } },
          },
        })
      );
      setOpen("", "image_ratio", false);
    }
  };

  useEffect(() => {
    if (open && typeof content?.image?.ratio !== "undefined") {
      setValue(content.image.ratio.toString());
    }
  }, [open, content?.image?.ratio]);

  return (
    <Fenster
      maxWidth="xs"
      open={Boolean(isOpen("image_ratio") && content)}
      title={t("Ratio")}
      onClose={() => setOpen("", "image_ratio", false)}
      actions={<KuiButton tx="confirm" onClick={handleConfirm} />}
    >
      <Stack spacing={2} sx={{ mt: 1 }}>
        <FormControl>
          <InputLabel>{t("Ratio")}</InputLabel>
          <Select
            label={t("Ratio")}
            value={getValue()}
            onChange={handleChangeSelect}
          >
            <MenuItem value="">-- Not on list --</MenuItem>
            {ratios.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" textAlign="center" color="textSecondary">
          {t("Or")}
        </Typography>
        <TextField
          label={t("Ratio")}
          value={value}
          onChange={handleChangeInput}
        />
      </Stack>
    </Fenster>
  );
};
