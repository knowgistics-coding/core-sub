import { Box, styled } from "@mui/material";

export const PaginationBlock = styled(Box, {
  shouldForwardProp: (props) => props !== "cover",
})<{ cover: boolean }>(({ theme, cover }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  zIndex: "1",
  width: cover ? "100%" : `calc(100% - ${theme.sidebarWidth}px)`,
  boxSizing: "border-box",
  padding: 32,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "width 0.25s",
  filter: "drop-shadow(0 0 16px #000000)",
  "& .swiper-pagination-bullet": {
    cursor: "pointer",
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 12,
    height: 12,
    borderRadius: 6,
    "&.swiper-pagination-bullet-active": {
      backgroundColor: "rgba(255,255,255,0.75)",
    },
    "&:not(:last-child)": {
      marginRight: 6,
    },
  },
}));
