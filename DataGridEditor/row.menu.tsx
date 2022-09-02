import { Menu, MenuItem } from "@mui/material";
import { useCore } from "../context";

export type RowAction = "insertbefore" | "insertafter" | "remove";
export type RowMenuProps = {
  anchorEl: Element | null;
  onClose: () => void;
  onRowAction: (action: RowAction) => () => void;
  disabledRemove?: boolean;
};
export const RowMenu = (props: RowMenuProps) => {
  const { t } = useCore();

  return (
    <Menu
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
    >
      <MenuItem onClick={props.onRowAction("insertbefore")}>
        {t("Insert Before")}
      </MenuItem>
      <MenuItem onClick={props.onRowAction("insertafter")}>
        {t("Insert After")}
      </MenuItem>
      {!Boolean(props.disabledRemove) && (
        <MenuItem
          onClick={props.onRowAction("remove")}
          sx={{ color: "error.main" }}
        >
          {t("Remove")}
        </MenuItem>
      )}
    </Menu>
  );
};
