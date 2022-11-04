import { Tooltip, IconButton } from "@mui/material";
import { useCore } from "../../context";
import { PickIcon } from "../../PickIcon";
import { usePE } from "../context";

export const PEContentSelectAll = () => {
  const { t } = useCore();
  const { data, setState } = usePE();

  const handleSelectAll = () =>
    setState((s) => ({ ...s, selected: data.contentGetKeys() }));

  return (
    <Tooltip title={t("Select $Name", { name: t("All") })}>
      <IconButton size="small" onClick={handleSelectAll} color="inherit">
        <PickIcon icon={"check-square"} />
      </IconButton>
    </Tooltip>
  );
};
