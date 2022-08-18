import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Badge,
  Divider,
  IconButton,
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
import { signOut, updateProfile } from "firebase/auth";
import { ProfileMenuNotSignListItem } from "./profile.menu.not.sign";
import { Fragment, useState } from "react";
import { KuiActionIcon } from "../KuiActionIcon";
import { usePopup } from "../react-popup";
import update from "react-addons-update";
import { StockImageTypes, StockPicker } from "../StockPicker";
import { useNavigate } from "react-router-dom";

const ListItemButtonErrorStyled = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.error.main,
}));
const FontAwesomeIconErrorStyled = styled(FontAwesomeIcon)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const MCProfileMenu = () => {
  const { fb, t, profileMenu, user, setUser } = useCore();
  const { handleOpen, state, setState, profileMenu: pfm } = useMC();
  const { Popup } = usePopup();
  const [open, setOpen] = useState<boolean>(false);
  const nav = useNavigate();

  const handleChangeDisplayName = () => {
    Popup.prompt({
      title: t("Edit$Name", { name: t("DisplayName") }),
      text: t("DisplayName"),
      icon: "edit",
      defaultValue: user?.data?.displayName || "",
      onConfirm: async (value) => {
        if (typeof value === "string" && user.data) {
          await updateProfile(user.data, { displayName: value });
          setUser((u) => update(u, { data: { $set: user.data } }));
        }
      },
    });
  };
  const handleChangePhotoURL = async (images: StockImageTypes[]) => {
    if (images[0] && user.data) {
      const { _id } = images[0];
      await updateProfile(user.data, {
        photoURL: `https://s1.phra.in:8086/file/id/${_id}/medium`,
      });
      setUser((u) => update(u, { data: { $set: user.data } }));
    }
  };
  const handleClose = () => setState((s) => ({ ...s, anchorProfile: null }));
  const handleSignOut = async () => {
    if (fb?.auth) {
      nav("/");
      await signOut(fb?.auth);
    }
    handleClose();
  };

  return (
    <>
      <Menu
        open={Boolean(user.data && state.anchorProfile)}
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
        sx={(theme) => ({
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: theme.sidebarWidth,
          },
        })}
      >
        <List dense>
          <ListItem sx={{ justifyContent: "center", pt: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "#0008",
                    transition: "background-color 0.25s ease-in-out",
                    "&:hover": { backgroundColor: "#000D" },
                  }}
                  onClick={() => setOpen(true)}
                >
                  <FontAwesomeIcon icon={["far", "camera"]} />
                </IconButton>
              }
            >
              <Avatar
                src={user?.data?.photoURL || undefined}
                sx={{ width: 128, height: 128 }}
              />
            </Badge>
          </ListItem>
          <ListItem sx={{ pb: 1 }}>
            <ListItemText
              primary={<>{user?.data?.displayName || ""}&nbsp;</>}
              primaryTypographyProps={{
                noWrap: true,
                variant: "body1",
                fontWeight: "bold",
              }}
            />
            <ListItemSecondaryAction>
              <KuiActionIcon tx="edit" onClick={handleChangeDisplayName} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          {pfm}
          {profileMenu}
          {user ? (
            <Fragment>
              <ListItemButton
                dense
                divider
                onClick={handleOpen("setting", true)}
              >
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
      <StockPicker
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleChangePhotoURL}
      />
    </>
  );
};
