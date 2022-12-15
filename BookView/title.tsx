import { Avatar, ListItemAvatar, ListItemText } from "@mui/material";
import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import React, { useEffect } from "react";
import { useBookView } from ".";
import { User } from "../Controller/user";

export type BookViewTitleProps = {
  title: React.ReactNode;
  userId?: string;
  selected?: boolean;
  onClick?: ListItemButtonProps["onClick"];
};
export const BookViewTitle = React.memo((props: BookViewTitleProps) => {
  const { user, setUser } = useBookView();

  useEffect(() => {
    if (props.userId) {
      User.getInfo(props.userId).then((user) =>
        setUser((s) => ({ ...s, loading: false, user }))
      );
    }
  }, [props.userId, setUser]);

  return (
    <ListItemButton
      divider
      selected={props.selected}
      sx={{
        "&.Mui-selected": {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        },
      }}
      onClick={props.onClick}
    >
      <ListItemAvatar>
        <Avatar src={user.user?.photoURL} />
      </ListItemAvatar>
      <ListItemText
        primary={props.title}
        primaryTypographyProps={{ variant: "h6" }}
      />
    </ListItemButton>
  );
});
