import { Box, Chip, styled } from "@mui/material";

export const ProfileArchs = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: "center",
  marginRight: theme.spacing(-1),
  "& .MuiChip-root": {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
  },
}));

export const ArchChip = styled(Chip)(({ theme }) => ({
  "& .MuiChip-icon": {
    color: theme.palette.warning.main,
    marginLeft: theme.spacing(1.5),
  }
}))