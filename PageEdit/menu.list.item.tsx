import {
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ReactNode } from "react";
import { PickIcon, PickIconName } from "../PickIcon";

export interface MenuListItemProps extends ListItemButtonProps {
  icon: PickIconName;
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
        <PickIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
};
