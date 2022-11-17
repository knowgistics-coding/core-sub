import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import ActionIcon from "../ActionIcon";
import { Comment } from "../Controller/social";
import { Time } from "../Controller/time";

const CommentTextBox = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(1, 1.5),
  "& .MuiTypography-caption": {
    display: "block",
    lineHeight: 1.1,
  },
}));

export const ReplyButton = styled("button")(({ theme }) => ({
  ...theme.typography.caption,
  cursor: "pointer",
  color: theme.palette.info.main,
  background: "none",
  border: "none",
  fontWeight: "bold",
  padding: 0,
  "&:hover": {
    textDecoration: "underline",
  },
  "&:active": {
    color: theme.palette.info.dark,
  },
}));

export type CommentBoxProps = {
  children?: React.ReactNode;
  comment: Comment;
  onReply?: () => void;
  onClickMore?: (elem: HTMLButtonElement, comment: Comment) => void;
};
export const CommentBox = ({ comment, ...props }: CommentBoxProps) => {
  return (
    <>
      <ListItem sx={{ pt: 0, pb: 0 }}>
        <ListItemAvatar>
          <Avatar src={comment.userInfo?.photoURL} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" spacing={1}>
              <CommentTextBox>
                <Typography variant="caption" color="textSecondary">
                  {comment.userInfo?.displayName}
                </Typography>
                <Typography variant="body2">{comment.value}</Typography>
              </CommentTextBox>
              {props.onClickMore && (
                <ActionIcon
                  icon="ellipsis-h"
                  color="default"
                  sx={{ width: 24, height: 24 }}
                  onClick={({ currentTarget }) =>
                    props.onClickMore?.(currentTarget, comment)
                  }
                />
              )}
            </Stack>
          }
          secondary={
            <Stack direction="row" spacing={1}>
              <span>{new Time(comment.datemodified).toShort()}</span>
              {props.onReply && (
                <ReplyButton onClick={props.onReply}>Reply</ReplyButton>
              )}
            </Stack>
          }
          secondaryTypographyProps={{ variant: "caption" }}
        />
      </ListItem>
      {props.children && <List sx={{ pl: 7 }}>{props.children}</List>}
    </>
  );
};
