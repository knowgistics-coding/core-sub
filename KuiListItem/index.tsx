import { ListItem, styled } from "@mui/material";

export const KuiListItem = styled(ListItem)(({ theme }) => ({
  "& .MuiListItemText-root": { marginTop: 0, marginBottom: 0 },
  "& .MuiListItemText-primary": theme.typography.body1,
  "& .MuiListItemText-secondary": theme.typography.caption,
}));
