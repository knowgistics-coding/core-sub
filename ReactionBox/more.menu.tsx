import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuProps,
} from "@mui/material";
import React from "react";
import { Comment } from "../Controller/social";
import { PickIcon, PickIconName } from "../PickIcon";

export const MenuItem = (props: {
  icon?: PickIconName;
  primary?: React.ReactNode;
  onClick?: () => void;
}) => (
  <ListItemButton dense onClick={props.onClick}>
    {props.icon && (
      <ListItemIcon>
        <PickIcon icon={props.icon} />
      </ListItemIcon>
    )}
    <ListItemText primary={props.primary} />
  </ListItemButton>
);

export type MoreMenuProps = {
  data: null | { elem: HTMLButtonElement; comment: Comment };
  onClose: () => void;
  children?: MenuProps["children"];
};
export const MoreMenu = (props: MoreMenuProps) => {
  return (
    <Menu
      elevation={3}
      open={Boolean(props.data)}
      anchorEl={props.data?.elem}
      onClose={props.onClose}
      anchorOrigin={{ vertical: "center", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {props.children}
    </Menu>
  );
};
