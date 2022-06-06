import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  styled,
} from "@mui/material";

import { useMC } from "./ctx";
import { useCore } from "../context";
import { signOut } from "firebase/auth";
import { ProfileMenuNotSignListItem } from "./profile.menu.not.sign";
import { Fragment } from "react";
import { defaultTheme } from "../default.theme";
import { KuiActionIcon } from "../KuiActionIcon";

const ListItemButtonErrorStyled = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));
const FontAwesomeIconErrorStyled = styled(FontAwesomeIcon)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const MCProfileMenu = () => {
  const { fb, t, user, profileMenu } = useCore();
  const { handleOpen, state, setState, profileMenu: pfm } = useMC();

  const handleClose = () => setState((s) => ({ ...s, anchorProfile: null }));
  const handleSignOut = async () => {
    if (fb?.auth) {
      await signOut(fb?.auth);
    }
    handleClose();
  };

  return (
    <Menu
      open={user.loading === false && Boolean(state.anchorProfile)}
      anchorEl={state.anchorProfile}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      disableEnforceFocus
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: defaultTheme.sidebarWidth,
        },
      }}
    >
      <List>
        <ListItem sx={{ justifyContent: "center", pt: 3 }}>
          <Avatar
            src={user?.data?.photoURL || undefined}
            sx={{ width: 128, height: 128 }}
          />
        </ListItem>
        <ListItem dense sx={{ pb: 1 }}>
          <ListItemIcon>
            <FontAwesomeIcon icon={["far", "user"]} />
          </ListItemIcon>
          <ListItemText
            primary={user?.data?.displayName}
            primaryTypographyProps={{ noWrap: true }}
          />
          <ListItemSecondaryAction>
            <KuiActionIcon tx="edit" />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        {pfm}
        {profileMenu}
        {user.data ? (
          <Fragment>
            <ListItemButton dense divider onClick={handleOpen("setting", true)}>
              <ListItemIcon>
                <FontAwesomeIcon icon={["far", "cog"]} />
              </ListItemIcon>
              <ListItemText primary={t("Setting")} />
            </ListItemButton>
            <ListItemButtonErrorStyled dense onClick={handleSignOut}>
              <ListItemIcon>
                <FontAwesomeIconErrorStyled icon={["far", "sign-in"]} />
              </ListItemIcon>
              <ListItemText primary={t("Sign out")} />
            </ListItemButtonErrorStyled>
          </Fragment>
        ) : (
          <ProfileMenuNotSignListItem onClose={handleClose} />
        )}
      </List>
    </Menu>
  );
};
