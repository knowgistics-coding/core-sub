import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fab } from "@mui/material";

import { useAlerts } from "../../Alerts";
import { useCore } from "../../context";
import { usePE } from "../context";

export const PEContentSaveButton = () => {
  const { t } = useCore();
  const { setState, onSave } = usePE();
  const { addAlert } = useAlerts();

  const handleSave = async () => {
    setState((s) => ({ ...s, loading: true }));
    const result = await onSave();
    if (result) {
      addAlert({ label: t("Saved") });
    }
    setState((s) => ({ ...s, loading: false }));
  };

  return (
    <Fab color="success" onClick={handleSave}>
      <FontAwesomeIcon size="2x" icon={["fad", "save"]} />
    </Fab>
  );
};
