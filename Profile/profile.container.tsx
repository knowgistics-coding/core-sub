import { Box, styled } from "@mui/material";

export const ProfileContainer = styled(Box)(({ theme }) => ({
  width: theme.sidebarWidth,
  marginInline: 'auto',
  marginTop: 80,
  paddingTop: 16
}))