import { Box, Skeleton } from "@mui/material";

export const LoadingBox = () => {
  return (
    <Box sx={{ mt: 3 }}>
      <Skeleton width={"50%"} sx={{ mb: 3 }} />
      <Box
        sx={(theme) => ({
          p: 3,
          borderRadius: theme.spacing(1),
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "divider",
        })}
      >
        <Skeleton width={"50%"} />
        <Skeleton width={"35%"} />
      </Box>
    </Box>
  );
};
