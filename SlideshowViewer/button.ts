import { Button, styled } from "@mui/material";

const ButtonStyled = styled(Button)({
  position: "absolute",
  bottom: 0,
  height: "calc(100% - 1rem)",
  zIndex: 1,
  color: "#FFF",
  background: 'linear-gradient(0deg, #0000 15%, #0001 50%, #0000 85%)',
  filter: 'drop-shadow(0 0 4px #0008)',
  "&:hover": {
    background: "linear-gradient(0deg, #0000 15%, #0004 50%, #0000 85%)",
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
