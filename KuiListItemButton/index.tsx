import { ListItemButton, styled } from "@mui/material";

export const KuiListItemButton = styled(ListItemButton)(({ theme }) => ({
  "&.Mui-selected": {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
    "& .MuiListItemText-primary": {
      color: theme.palette.info.contrastText,
    },
    "& .svg-inline--fa": {
      color: theme.palette.info.contrastText,
    }
  }
}))