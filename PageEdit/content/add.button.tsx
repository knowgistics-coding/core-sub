import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fab } from "@mui/material";
import React from "react";
import { ShowTypes, usePE } from "../context";
import { Blocks } from "./blocks";

const genKey = (): string => Math.round(Math.random() * 1000000).toString();

export const PEContentAddButton = () => {
  const { show, setData } = usePE();
  const handleAddContent = (type: ShowTypes) => () => {
    setData((d) => {
      const contents = [...(d.contents || [])].concat({ type, key: genKey() });
      return { ...d, contents };
    });

    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100)
  };

  return (
    <React.Fragment>
      {Blocks.filter((block) => show.includes(block.key)).map((block) => (
        <Fab
          size="small"
          color="info"
          key={block.key}
          onClick={handleAddContent(block.key)}
        >
          <FontAwesomeIcon icon={block.icon} />
        </Fab>
      ))}
      {/* <FabStyled onClick={handleOpen}>
        <FontAwesomeIcon icon={["far", "plus"]} size="2x" />
      </FabStyled> */}
      {/* <Menu
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorEl={anchorEl}
        sx={{ zIndex: 1401 }}
      >
        <List dense>
          {Blocks.filter((block) => show.includes(block.key)).map((block) => (
            <ListItemButton
              key={block.key}
              onClick={handleAddContent(block.key)}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={block.icon} />
              </ListItemIcon>
              <ListItemText primary={t(block.title)} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleHideToolbarToggle}>
            <ListItemIcon>
              <Checkbox edge="start" size="small" checked={hideToolbar} />
            </ListItemIcon>
            <ListItemText primary={t("Hide Toolbar")} />
          </ListItemButton>
        </List>
      </Menu> */}
    </React.Fragment>
  );
};
