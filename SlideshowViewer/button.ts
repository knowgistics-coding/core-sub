import { Button, styled } from "@mui/material";

const ButtonStyled = styled(Button)({
  position: "absolute",
  bottom: 0,
  height: "calc(100% - 1rem)",
  zIndex: 1,
  color: "white",
  transition: "all 0.25s",
  backgroundColor: '#FFF8',
  background: "none",
  "&:hover": {
    background: "linear-gradient(0deg, rgba(255,255,255,0.125) 0%, rgba(255,255,255,0) 100%)",
  }
});

export const PrevButton = styled(ButtonStyled)({
  left: 0,
});

export const NextButton = styled(ButtonStyled, {
  shouldForwardProp: (props) => props !== "cover",
})<{ cover: boolean }>(({ theme, cover }) => ({
  right: cover ? 0 : theme.sidebarWidth,
}));
