import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps } from "@mui/material";

export const SidebarToggleButton = (props: IconButtonProps) => {
  return (
    <IconButton edge="start" {...props}>
      <FontAwesomeIcon icon={["far", "bars"]} />
    </IconButton>
  );
};
