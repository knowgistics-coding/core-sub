import * as React from "react";
import { ListItem, TextField } from "@mui/material";
import { useCore } from "../context";
import debounce from "lodash.debounce";

const debounceValue = debounce((func: () => void) => func(), 500);

export interface TitleDebounceProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const TitleDebounce = (props: TitleDebounceProps) => {
  const { t } = useCore();
  const [value, setValue] = React.useState<string>("");

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    debounceValue(() => props.onChange?.(value));
  };

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <ListItem divider sx={{ pt: 1.5 }}>
      <TextField
        fullWidth
        label={t("Title")}
        InputLabelProps={{ shrink: true }}
        InputProps={{ placeholder: t("No Title") }}
        size="small"
        value={value}
        onChange={handleChange}
      />
    </ListItem>
  );
};
