import {
  Avatar,
  Box,
  Collapse,
  Stack,
  styled,
  Typography,
} from "@mui/material";

export const ChatBox = {
  Root: styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    width: theme.sidebarWidth,
    borderRadius: theme.spacing(2, 2, 0, 0),
    overflow: "hidden",
    border: `solid 1px ${theme.palette.divider}`,
  })),
  Head: styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderBottom: `solid 1px ${theme.palette.divider}`,
    color: theme.palette.info.contrastText,
    padding: theme.spacing(1, 1.5),
  })),
  Avatar: styled(Avatar)({
    width: 24,
    height: 24,
    marginRight: 8,
  }),
  Name: styled(Typography)({}),
  Body: styled(Collapse)(({ theme }) => ({
    "& .MuiPaper-root": {
      height: theme.sidebarWidth,
    },
  })),
};

ChatBox.Head.defaultProps = {
  spacing: 0.5,
  direction: "row",
  alignItems: "center",
};
ChatBox.Name.defaultProps = {
  variant: "caption",
};
