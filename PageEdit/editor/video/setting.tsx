import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { VideoContent } from "../../../VideoDisplay";
import { useCore } from "../../../context";
import { useEffect, useState } from "react";
import { KuiButton } from "../../../KuiButton";
import { DialogCompact } from "../../../DialogCompact";

const fromList: VideoContent["from"][] = [
  "link",
  "facebook",
  "youtube",
  "loom",
];

export type SettingDialogProps = {
  open: boolean;
  value?: VideoContent;
  onChange: (value: VideoContent) => void;
  onClose: () => void;
};
export const SettingDialog = ({ value, ...props }: SettingDialogProps) => {
  const { t } = useCore();
  const [data, setData] = useState<VideoContent>({});

  const handleChangeFrom = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as VideoContent["from"];
    setData((d) => ({ ...d, from: value }));
  };
  const handleChangeURL = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setData((d) => ({ ...d, value }));
  };
  const handleChangeRatio = ({
    target: { value },
  }: SelectChangeEvent<number>) => {
    if (typeof value === "number") {
      setData((d) => ({ ...d, ratio: value }));
    }
  };
  const handleConfirm = () => {
    props.onChange(data);
  };

  useEffect(() => {
    if (props.open && value) {
      setData({ ...value });
    }
  }, [props.open, value]);

  return (
    <DialogCompact
      maxWidth="xs"
      open={props.open}
      onClose={props.onClose}
      title={t("Setting")}
      actions={<KuiButton tx="confirm" onClick={handleConfirm} />}
      icon="cog"
    >
      <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
        <InputLabel>{t("From")}</InputLabel>
        <Select
          label={t("From")}
          value={data?.from || ""}
          onChange={handleChangeFrom}
        >
          {fromList.map((value) => (
            <MenuItem value={value} key={value}>
              {value?.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="URL / Code"
        value={data?.value || ""}
        multiline
        onChange={handleChangeURL}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth>
        <InputLabel>{t("Ratio")}</InputLabel>
        <Select
          label={t("Ratio")}
          value={data?.ratio || 9 / 16}
          onChange={handleChangeRatio}
        >
          <MenuItem value={9 / 16}>16:9</MenuItem>
          <MenuItem value={3 / 4}>4:3</MenuItem>
          <MenuItem value={1}>1:1</MenuItem>
        </Select>
      </FormControl>
    </DialogCompact>
  );
};
