import {
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Stack,
  StackProps,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useCore } from "../context";

export interface TitleNameProps {
  value?: string;
  label: React.ReactNode;
  onChange: (value: string) => void;
  lists: { label?: React.ReactNode; value: string }[];
  componentProps?: {
    formControl?: Omit<FormControlProps, "children">;
    inputLabel?: Omit<InputLabelProps, "children">;
    select?: Omit<SelectProps, "value" | "onChange" | "label" | "children">;
    stack?: Omit<StackProps, "children">
  };
}
export const TitleName = (props: TitleNameProps) => {
  const { t } = useCore();

  const isInLists = (): boolean =>
    props.lists.findIndex((l) => l.value === props.value) > -1;
  const getValue = (): string => {
    if (props.value && isInLists()) {
      return props.value;
    }
    return "";
  };
  const handleChange = ({ target: { value } }: SelectChangeEvent<unknown>) => {
    props.onChange(`${value}`);
  };
  const handleChangeInput = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(value);
  };

  return (
    <Stack direction="row" spacing={1} {...props.componentProps?.stack}>
      <FormControl {...props.componentProps?.formControl} sx={{ flex: 1 }}>
        <InputLabel shrink {...props.componentProps?.inputLabel}>
          {props.label}
        </InputLabel>
        <Select
          value={getValue()}
          onChange={handleChange}
          label={props.label}
          displayEmpty
          {...props.componentProps?.select}
        >
          {props.lists.map((item) => (
            <MenuItem value={item.value} key={item.value}>
              {item.label || item.value}
            </MenuItem>
          ))}
          <MenuItem value="">{t("Other")}</MenuItem>
        </Select>
      </FormControl>
      {isInLists() === false && (
        <TextField
          value={props.value}
          onChange={handleChangeInput}
          sx={{ flex: 2 }}
        />
      )}
    </Stack>
  );
};
