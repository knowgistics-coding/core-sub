import { IconButton, IconButtonProps } from "@mui/material";
import { PickIcon } from "../PickIcon";

export const SidebarToggleButton = (props: IconButtonProps) => {
  return (
    <IconButton edge="start" {...props}>
      <PickIcon icon={"bars"} />
    </IconButton>
  );
};
