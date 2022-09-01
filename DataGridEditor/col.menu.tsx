import { Menu, MenuItem } from "@mui/material";
import { useCore } from "../context";

export type ColAction = "edit" | "insertbefore" | "insertafter" | "remove";
export type ColMenuProps = {
  anchorEl: Element | null;
  onClose: () => void;
  onColAction: (action: ColAction) => () => void;
  disableRemove?: boolean;
};
export const ColMenu = (props: ColMenuProps) => {
  const { t } = useCore();
  return (
    <Menu
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onColAction("edit")}>{t("Edit")}</MenuItem>
      <MenuItem onClick={props.onColAction("insertbefore")}>
        {t("Insert Before")}
      </MenuItem>
      <MenuItem onClick={props.onColAction("insertafter")}>
        {t("Insert After")}
      </MenuItem>
      {!Boolean(props.disableRemove) && (
        <MenuItem
          onClick={props.onColAction("remove")}
          sx={{ color: "error.main" }}
        >
          {t("Remove")}
        </MenuItem>
      )}
    </Menu>
  );
};
