import { Box, styled } from "@mui/material";

export const SlideBox = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  backgroundColor: theme.palette.divider,
  border: `solid 1px ${theme.palette.divider}`,
  cursor: "grab",
  height: "100%",
  display: "flex",
  "&:active": {
    cursor: "grabbing",
  },
}));