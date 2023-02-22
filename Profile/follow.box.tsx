import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCore } from "../context";
import { ProfileValue } from "../Controller/profile";
import { User } from "../Controller/user";
import { DialogCompact } from "../DialogCompact";
import { KuiList } from "../KuiList";

const Item = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  padding: theme.spacing(1, 0.5),
  "&:not(:last-child)": {
    borderRight: `solid 1px ${theme.palette.divider}`,
  },
}));

type UserListProps = {
  uid: string;
  photoURL: string | null;
  displayName: string | null;
};
const UserList = ({ uid, photoURL, displayName, ...props }: UserListProps) => {
  return (
    <ListItemButton
      divider
      LinkComponent={"a"}
      href={`/profile/${uid}`}
      target="_blank"
    >
      <ListItemAvatar>
        <Avatar src={photoURL ?? undefined} />
      </ListItemAvatar>
      <ListItemText primary={displayName} />
    </ListItemButton>
  );
};

export const FollowBox = (props: {
  profile?: ProfileValue;
  borders?: boolean;
}) => {
  const { t } = useCore();
  const [state, setState] = useState<{
    open: string;
    users: Record<string, User>;
  }>({
    open: "",
    users: {},
  });

  const handleOpen = (open: string) => () => setState((s) => ({ ...s, open }));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          border: props.borders ? `solid 1px` : "none",
          borderColor: props.borders ? "divider" : "transparent",
          borderBottom: "solid 1px",
          borderBottomColor: "divider",
        }}
      >
        <Item onClick={handleOpen("following")}>
          <Typography variant="h6">
            {props.profile?.following.length ?? 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t("Following")}
          </Typography>
        </Item>
        <Item onClick={handleOpen("followers")}>
          <Typography variant="h6">
            {props.profile?.followers.length ?? 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t("Followers")}
          </Typography>
        </Item>
      </Box>
      <DialogCompact
        open={state.open === "following"}
        title={t("Following")}
        onClose={handleOpen("")}
      >
        <KuiList divider length={props.profile?.following.length ?? 0}>
          {props.profile?.following.map((item) => (
            <UserList
              uid={item.to}
              photoURL={item.photoURL}
              displayName={item.displayName}
              key={item.to}
            />
          ))}
        </KuiList>
      </DialogCompact>
      <DialogCompact
        open={state.open === "followers"}
        title={t("Followers")}
        onClose={handleOpen("")}
      >
        <KuiList divider length={props.profile?.followers.length ?? 0}>
          {props.profile?.followers.map((item) => (
            <UserList
              uid={item.user}
              photoURL={item.photoURL}
              displayName={item.displayName}
              key={item.user}
            />
          ))}
        </KuiList>
      </DialogCompact>
    </>
  );
};
