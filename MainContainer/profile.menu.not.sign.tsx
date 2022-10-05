import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import * as React from "react";

import { useCore } from "../context";
import { PickIcon } from "../PickIcon";
import { SignIn } from "../SignIn";

const ProfileMenuNotSignContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

export const ProfileMenuNotSign = (
  props: React.HTMLAttributes<React.ReactFragment>
) => {
  const { user } = useCore();
  const [open, setOpen] = React.useState(false);

  return (
    <ProfileMenuNotSignContext.Provider value={{ open, setOpen }}>
      {props.children}
      {open && !Boolean(user.data) && <SignIn onClose={() => setOpen(false)} />}
    </ProfileMenuNotSignContext.Provider>
  );
};

interface ProfileMenuNotSignListItemProps {
  onClose: () => void;
}
export const ProfileMenuNotSignListItem = (
  props: ProfileMenuNotSignListItemProps
) => {
  const { t } = useCore();
  const { setOpen } = React.useContext(ProfileMenuNotSignContext);

  return (
    <ListItemButton
      dense
      onClick={() => {
        setOpen(true);
        props.onClose();
      }}
    >
      <ListItemIcon>
        <PickIcon icon={"sign-in"} />
      </ListItemIcon>
      <ListItemText primary={t("Sign In")} />
    </ListItemButton>
  );
};
