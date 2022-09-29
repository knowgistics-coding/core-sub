import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, IconButton } from "@mui/material";
import { useCore } from "../../context";
import { usePE } from "../context";

export const PEContentSelectAll = () => {
  const { t } = useCore();
  const { setState, data } = usePE();

  const handleSelectAll = () => {
    if (data.contents) {
      const selected = data.contents.map((content) => content.key);
      setState((s) => ({ ...s, selected }));
    }
  };

  return (
    <Tooltip title={t("Select $Name", {name:t("All")})}>
      <IconButton size="small" onClick={handleSelectAll}>
        <FontAwesomeIcon icon={["far", "check-square"]} />
      </IconButton>
    </Tooltip>
  );
};
