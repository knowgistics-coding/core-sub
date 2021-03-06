import { Box, Slider as SLD, Typography } from "@mui/material";
import { Fragment } from "react";
import { ActionIcon } from "../ActionIcon";

export interface SliderProps {
  label: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
}
export const Slider = ({ label, value, onChange }: SliderProps) => {
  const handleChange = (_event: Event, n: number | number[]) =>
    onChange(Array.isArray(n) ? n[0] : n);
  return (
    <Fragment>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Box display="flex">
        <SLD value={value} onChange={handleChange} sx={{ mr: 1 }} />
        <ActionIcon
          icon={["fad", "redo"]}
          color="error"
          onClick={() => onChange(50)}
        />
      </Box>
    </Fragment>
  );
};
