import { Paper, styled } from "@mui/material";

export const Root = styled(Paper)(({ theme }) => ({
  width: theme.sidebarWidth * 1.25,
  maxWidth: "calc(100vmin - 48px)",
  position: "absolute",
  bottom: 0,
  right: 0,
  boxSizing: "border-box",
  border: `solid 1px ${theme.palette.grey[300]}`,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
}));