import { ListItemText } from "@mui/material";
import { KuiListItemButton } from "../KuiListItemButton";

export type ButtonHomeProps = {
  primary?: string;
  secondary?: string;
};
export const ButtonHome = (props: ButtonHomeProps) => {
  return (
    <KuiListItemButton dense selected>
      <ListItemText
        primary={props.primary}
        secondary={props.secondary}
        primaryTypographyProps={{ variant: "h6" }}
        secondaryTypographyProps={{ variant: "caption", color: "inherit" }}
      />
    </KuiListItemButton>
  );
};
