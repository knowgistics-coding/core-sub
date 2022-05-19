import { ListItem, TextField } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useCore } from "../../context";
import debounce from "lodash.debounce";

interface PETitleProps {
  value?: string;
  onChange: (value: string) => void;
  divider?: boolean;
}
export const PETitle = ({
  value: defaultValue,
  onChange,
  divider,
}: PETitleProps) => {
  const { t } = useCore();
  const [value, setValue] = useState<string>("");

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(value);
    debouncedChangeHandler()(value);
  };

  const debouncedChangeHandler = React.useCallback(() => {
    return debounce((value: string) => {
      onChange(value);
    }, 500);
  }, [onChange]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <Fragment>
      <ListItem divider={divider}>
        <TextField
          size="small"
          label={t("Title")}
          fullWidth
          variant="outlined"
          value={value}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />
      </ListItem>
    </Fragment>
  );
};
