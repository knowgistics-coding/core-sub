import { Box, ListItem, Stack, styled, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import moment from "moment";

export const ChatContent = styled(Box)(() => ({
  position: "relative",
  border: `solid 1px ${grey[300]}`,
  borderRight: "none",
  borderLeft: "none",
  "&:before": {
    content: "''",
    display: "block",
    paddingTop: "calc(100%)",
  },
  "&>*": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column-reverse",
  },
}));

export const ChatItem = styled(ListItem)(() => ({
  "& .MuiTypography-root": {
    lineHeight: 1.25,
  },
  "& .MuiListItemAvatar-root": {
    minWidth: 48,
  },
  "& .MuiAvatar-root": {
    width: 36,
    height: 36,
  },
  "& .MuiListItemText-multiline": {
    margin: 0,
  },
}));

export const ChatItemTextPrimary = (props: {
  uid: string,
  displayName?: string;
  timestamp: number;
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="inherit" fontWeight="bold">
        {props.displayName || `@${props.uid.slice(0,8)}...`}
      </Typography>
      <Typography variant="inherit" color="textSecondary">
        {moment(props.timestamp).format("L")}
      </Typography>
    </Stack>
  );
};

export const ChatMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(0.5),
}));
