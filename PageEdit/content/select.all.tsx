import { Tooltip, IconButton } from "@mui/material";
import { useCore } from "../../context";
import { PickIcon } from "../../PickIcon";
import { usePE } from "../context";

export const PEContentSelectAll = () => {
  const { t } = useCore();
  const { setState, pageData } = usePE();

  const handleSelectAll = () =>
    setState((s) => ({ ...s, selected: pageData.content.getKeys() }));

  return (
    <Tooltip title={t("Select $Name", { name: t("All") })}>
      <IconButton size="small" onClick={handleSelectAll} color="inherit">
        <PickIcon icon={"check-square"} />
      </IconButton>
    </Tooltip>
  );
};
