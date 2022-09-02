import {
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
} from "@mui/material";
import { useCore } from "../context";

export type VisibilityValue = "public" | "private" | "trash";
export interface VisibilitySelectProps {
  value?: VisibilityValue;
  onChange?: (value: VisibilityValue) => void;
}
export const VisibilitySelect = (props: VisibilitySelectProps) => {
  const { t } = useCore();
  return (
    <ListItem divider sx={{ pt: 1.5 }}>
      <FormControl size="small" fullWidth>
        <InputLabel>{t("Visibility")}</InputLabel>
        <Select
          label={t("Visibility")}
          value={
            props.value && ["public", "private"].includes(props.value)
              ? props.value
              : ""
          }
          onChange={({ target: { value } }) =>
            props.onChange?.(value as VisibilityValue)
          }
        >
          <MenuItem value="public">{t("Public")}</MenuItem>
          <MenuItem value="private">{t("Private")}</MenuItem>
        </Select>
      </FormControl>
    </ListItem>
  );
};
