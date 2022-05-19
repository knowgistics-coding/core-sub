import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  styled,
} from "@mui/material";

import { useMC } from "./ctx";
import { useCore } from "../context";
import { signOut } from "firebase/auth";
import { ProfileMenuNotSign } from "./profile.menu.not.sign";
import { Fragment } from "react";

const ListItemButtonErrorStyled = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));
const FontAwesomeIconErrorStyled = styled(FontAwesomeIcon)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const MCProfileMenu = () => {
  const { fb, t, profileMenu } = useCore();
  const { handleOpen, user, state, setState, profileMenu: pfm } = useMC();

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
    >
      <List>
        {pfm}
        {profileMenu}
        {user.data ? (
          <Fragment>
            <ListItemButton dense onClick={handleOpen("setting", true)}>
              <ListItemIcon>
                <FontAwesomeIcon icon={["fad", "cog"]} />
              </ListItemIcon>
              <ListItemText primary={t("Setting")} />
            </ListItemButton>
            <ListItemButtonErrorStyled dense onClick={handleSignOut}>
              <ListItemIcon>
                <FontAwesomeIconErrorStyled icon={["fad", "sign-in"]} />
              </ListItemIcon>
              <ListItemText primary={t("Sign out")} />
            </ListItemButtonErrorStyled>
          </Fragment>
        ) : (
          <ProfileMenuNotSign onClose={handleClose} />
        )}
      </List>
    </Menu>
  );
};
