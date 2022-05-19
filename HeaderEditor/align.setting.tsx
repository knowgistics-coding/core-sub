import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MenuItem, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";

export type alignType = "left" | "center" | "right";
const icons: { [key in alignType]: IconProp } = {
  left: ["fad", "align-left"],
  center: ["fad", "align-center"],
  right: ["fad", "align-right"],
};

interface AlignSettingProps {
  modalHandler?: any;
  value: alignType;
  onAlignChange: (value: AlignSettingProps["value"]) => void;
}
export const AlignSetting = ({ value, onAlignChange }: AlignSettingProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLAnchorElement>(null);

  const handleOpen = ({ currentTarget }: MouseEvent<HTMLAnchorElement>) =>
    setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChange = (value: AlignSettingProps["value"]) => () => {
    onAlignChange(value);
    handleClose();
  };

  return (
    <React.Fragment>
      <div
        className="rdw-dropdown-wrapper"
        aria-label="rdw-dropdown"
        aria-expanded="true"
        style={{ width: 60 }}
      >
        <Typography
          className="rdw-dropdown-selectedtext"
          title="Variant"
          onMouseDown={handleOpen}
          variant="caption"
        >
          <FontAwesomeIcon icon={icons[value] || ["fad", "align-left"]} />
          <div
            className={
              Boolean(anchorEl)
                ? "rdw-dropdown-carettoclose"
                : "rdw-dropdown-carettoopen"
            }
          ></div>
        </Typography>
      </div>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleChange("left")}>
          <FontAwesomeIcon icon={["fad", "align-left"]} />
        </MenuItem>
        <MenuItem onClick={handleChange("center")}>
          <FontAwesomeIcon icon={["fad", "align-center"]} />
        </MenuItem>
        <MenuItem onClick={handleChange("right")}>
          <FontAwesomeIcon icon={["fad", "align-right"]} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
