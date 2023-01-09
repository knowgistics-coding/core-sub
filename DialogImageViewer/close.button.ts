import { styled } from "@mui/material";
import ActionIcon from "../ActionIcon";

export const CloseButton = styled(ActionIcon)({
  position: "absolute",
  top: 16,
  left: 16,
  backgroundColor: "#FFF8",
  color: "#333",
  zIndex: 1,
  "&:hover": {
    backgroundColor: "#FFFB",
  }
});
CloseButton.defaultProps = {
  size: "large",
};