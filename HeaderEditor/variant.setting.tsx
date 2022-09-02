import * as React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import { MouseEvent, useState } from "react";

export type variants = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
interface VariantSettingProps {
  modalHandler?: any;
  value: variants;
  onVariantChange: (value: VariantSettingProps["value"]) => void;
}
export const VariantSetting = ({
  value,
  onVariantChange,
}: VariantSettingProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLAnchorElement>(null);

  const handleOpen = ({ currentTarget }: MouseEvent<HTMLAnchorElement>) =>
    setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChange = (value: VariantSettingProps["value"]) => () => {
    onVariantChange(value);
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
          {value.toLocaleUpperCase()}
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
        {(["h1", "h2", "h3", "h4", "h5", "h6"] as variants[]).map(
          (val: variants) => (
            <MenuItem key={val} onClick={handleChange(val)}>
              {val.toUpperCase()}
            </MenuItem>
          )
        )}
      </Menu>
    </React.Fragment>
  );
};
