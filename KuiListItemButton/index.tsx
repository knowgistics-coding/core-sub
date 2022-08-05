import {
  Box,
  ListItemButton,
  ListItemButtonProps,
  styled,
} from "@mui/material";

export const KuiListItemButton = styled(
  ({
    children,
    actions,
    ...props
  }: ListItemButtonProps & { actions?: React.ReactNode }) => (
    <Box sx={{ position: "relative" }}>
      <ListItemButton {...props}>{children}</ListItemButton>
      {actions && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            display: "flex",
            px: 2,
            alignItems: "center",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  )
)<ListItemButtonProps>(({ theme }) => ({
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
    },
  },
}));
