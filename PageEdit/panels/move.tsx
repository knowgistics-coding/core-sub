import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { usePE } from "../context";
import { useCore } from "../../context";
import { Fragment } from "react";
import { PickIcon } from "../../PickIcon";

interface PanelMoveProps {
  index: number;
  onClose: () => void;
}
export const PanelMove = ({ index, onClose }: PanelMoveProps): JSX.Element => {
  const { t } = useCore();
  const { data, setData } = usePE();

  const handleMoveUp = () => {
    if (index > 0) {
      setData(data.contentMoved(index, index - 1));
    }
    onClose();
  };
  const handleMoveDown = () => {
    if (
      data.contents?.length &&
      index + 1 < data.contents?.length &&
      data.contents
    ) {
      setData(data.contentMoved(index, index + 1));
    }
    onClose();
  };

  const MoveUp = () => (
    <ListItemButton onClick={handleMoveUp}>
      <ListItemIcon>
        <PickIcon icon={"chevron-up"} />
      </ListItemIcon>
      <ListItemText primary={t("Move Up")} />
    </ListItemButton>
  );
  const MoveDown = () => (
    <ListItemButton onClick={handleMoveDown}>
      <ListItemIcon>
        <PickIcon icon={"chevron-down"} />
      </ListItemIcon>
      <ListItemText primary={t("Move Down")} />
    </ListItemButton>
  );

  return (
    <Fragment>
      {index > 0 && <MoveUp />}
      {data.contents?.length && index + 1 < data.contents?.length && (
        <MoveDown />
      )}
    </Fragment>
  );
};
