import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";

export interface MenuListItemProps extends ListItemButtonProps {
  icon: IconName;
  primary?: ReactNode;
}
export const MenuListItem = ({
  icon,
  primary,
  ...props
}: MenuListItemProps) => {
  return (
    <ListItemButton {...props}>
      <ListItemIcon>
        <FontAwesomeIcon icon={["far", icon]} />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
};
