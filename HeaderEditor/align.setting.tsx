import { Menu, MenuItem, Typography } from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { PickIcon, PickIconName } from "../PickIcon";

export type alignType = "left" | "center" | "right";
const icons: { [key in alignType]: PickIconName } = {
  left: "align-left",
  center: "align-center",
  right: "align-right",
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
          <PickIcon icon={icons[value] || "align-left"} />
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
          <PickIcon icon={"align-left"} />
        </MenuItem>
        <MenuItem onClick={handleChange("center")}>
          <PickIcon icon={"align-center"} />
        </MenuItem>
        <MenuItem onClick={handleChange("right")}>
          <PickIcon icon={"align-right"} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
