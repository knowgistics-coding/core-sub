import { ListItemButton, styled } from "@mui/material";

export const KuiListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    }
  }
}))