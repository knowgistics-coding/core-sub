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
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Box display="flex">
        <SLD
          value={value}
          onChange={handleChange}
          sx={{ mr: 1, color: "info.main" }}
        />
        <ActionIcon
          icon={["far", "redo"]}
          onClick={() => onChange(50)}
          sx={{ color: "neutral.main" }}
        />
      </Box>
    </Fragment>
  );
};
