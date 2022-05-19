import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Fab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  styled,
} from "@mui/material";
import { contentLists, showTypes, useCE } from "../ctx";
import { FAIcon } from "../../FAIcon";
import { useCore } from "../../context";
import { genKey } from "draft-js";
import update from "react-addons-update";

export const CEAddButton = styled((props) => {
  const { t } = useCore();
  const { show, setData } = useCE();
  const [anchor, setAnchor] = useState<Element | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    const anchor = event.currentTarget;
    setAnchor(anchor);
  };
  const handleClose = () => setAnchor(null);
  const handleAdd = (type: showTypes) => () => {
    setData((d) => ({
      ...d,
      contents: update(d.contents || [], { $push: [{ type, key: genKey() }] }),
    }));
    handleClose();
  };

  return (
    <Fragment>
      <Fab color="primary" {...props} onClick={handleOpen}>
        <FontAwesomeIcon size="2x" icon={["fad", "plus"]} />
      </Fab>
      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <List style={{ width: "100%", maxWidth: 270 }}>
          {contentLists.filter((item) => show.includes(item.id)).length ===
            0 && (
            <ListItemButton disabled>
              <ListItemText
                primary={t("Empty")}
                primaryTypographyProps={{ color: "textSecondary" }}
              />
            </ListItemButton>
          )}
          {contentLists
            .filter((item) => show.includes(item.id))
            .map((item) => (
              <ListItemButton key={item.id} onClick={handleAdd(item.id)}>
                <ListItemIcon>
                  <FAIcon icon={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={t(item.label)}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            ))}
        </List>
      </Menu>
    </Fragment>
  );
})({
  position: "fixed",
  bottom: "1rem",
  right: "1rem",
});
