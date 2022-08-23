import { Box, Typography, LinearProgress } from "@mui/material";

export const Progress = ({
  loading,
  step,
  length,
}: {
  loading?: boolean;
  step: number;
  length?: number;
}) => {
  return (
    <Box
      sx={{
        p: 2,
        border: "solid 1px",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="caption"
        color="textSecondary"
        component="div"
        sx={{ pb: 1 }}
      >
        {step + 1}/{length || "?"}
      </Typography>
      <LinearProgress
        color="warning"
        value={Math.round((step / ((length || 1) - 1)) * 100)}
        variant={loading ? "indeterminate" : "determinate"}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};
