import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grow,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
} from "@mui/material";
import { KuiButton } from "../KuiButton";
import { timezone } from "./tz";
import moment from "moment";

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  ...theme.typography.caption,
  wordWrap: "break-word",
}));

export interface ScheduleProps {
  open: boolean;
  value?: string;
  onChange: (value: string) => void;
  onClose: () => void;
}
export const Schedule = ({ open, value, onChange, onClose }: ScheduleProps) => {
  const [state, setState] = useState<{ datetime: string; gmt: string }>({
    datetime: "",
    gmt: "+07:00",
  });

  const handleChange =
    (key: "datetime" | "gmt") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setState((s) => ({ ...s, [key]: value }));
    };
  const handleSelectChange =
    (key: "datetime" | "gmt") => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      setState((s) => ({ ...s, [key]: value }));
    };
  const handleConfirm = () => {
    const stringDate = `${state.datetime}:00.0000${state.gmt}`;
    onChange(stringDate);
    onClose();
  };

  useEffect(() => {
    if (value && open) {
      const check =
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00.0000[+-]{1}\d{2}:\d{2}/.test(value);
      if (check) {
        const [datetime, gmt] = value.split(":00.0000");
        setState((s) => ({ ...s, datetime, gmt }));
      }
    } else {
      setState((s) => ({
        ...s,
        datetime: moment().format(`YYYY-MM-DDTHH:mm`),
      }));
    }
  }, [open, value]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      TransitionComponent={Grow}
    >
      <DialogTitle>Schedule</DialogTitle>
      <DialogContent>
        <Box pt={1} />
        <TextField
          autoFocus
          fullWidth
          label="Date & Time"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={state.datetime}
          onChange={handleChange("datetime")}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Time Zone</InputLabel>
          <Select
            label="Time Zone"
            value={state.gmt}
            onChange={handleSelectChange("gmt")}
            MenuProps={{ PaperProps: { style: { maxWidth: "20ch" } } }}
          >
            {timezone.map((item) => (
              <MenuItemStyled key={item[0]} value={item[0]}>
                ({item[0]}) {item[1]}
              </MenuItemStyled>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <KuiButton
          tx="confirm"
          onClick={handleConfirm}
          disabled={!Boolean(state.datetime && state.gmt)}
        />
        <KuiButton tx="cancel" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};
