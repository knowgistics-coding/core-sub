import {
  alpha,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  ListItemTextProps,
  styled,
} from "@mui/material";

const ListItemButtonInfo = styled(ListItemButton)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    color: alpha(theme.palette.text.primary, 0.5),
  },
  "& .MuiListItemText-secondary": {
    color: theme.palette.text.primary,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.info.main,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
    "& .MuiListItemText-primary": {
      color: alpha(theme.palette.info.contrastText, 0.5),
    },
    "& .MuiListItemText-secondary": {
      color: theme.palette.info.contrastText,
    },
  },
}));

export interface TitleSidebarProps extends ListItemButtonProps {
  title?: string;
  listItemTextProps?: ListItemTextProps;
}
export const TitleSidebar = ({
  title,
  listItemTextProps,
  ...props
}: TitleSidebarProps) => {
  return (
    <ListItemButtonInfo {...props}>
      <ListItemText
        primary={"Title"}
        secondary={title || "No Title"}
        primaryTypographyProps={{ variant: "caption" }}
        secondaryTypographyProps={{ variant: "h6" }}
        {...listItemTextProps}
      />
    </ListItemButtonInfo>
  );
};
