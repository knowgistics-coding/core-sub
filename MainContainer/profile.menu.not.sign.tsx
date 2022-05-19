import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Fragment, useState } from "react";

import { useCore } from "../context";
import { SignIn } from "../SignIn";

interface ProfileMenuNotSignProps {
  onClose: () => void;
}
export const ProfileMenuNotSign = ({}: ProfileMenuNotSignProps) => {
  const { t } = useCore();
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <ListItemButton dense onClick={() => setOpen(true)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={["fad", "sign-in"]} />
        </ListItemIcon>
        <ListItemText primary={t("Sign In")} />
      </ListItemButton>
      {open && <SignIn onClose={() => setOpen(false)} />}
    </Fragment>
  );
};
