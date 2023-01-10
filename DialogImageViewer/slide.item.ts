import { Box, styled } from "@mui/material";

export const SlideItem = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  display: "flex",
  "& canvas, img": theme.mixins.absoluteFluid,
  "& canvas": { objectFit: "cover" },
  "& img": { objectFit: "contain" },
  "& .image": {
    position: "relative",
    width: `calc(100vw - ${theme.sidebarWidth*1.5}px)`,
  },
}));
