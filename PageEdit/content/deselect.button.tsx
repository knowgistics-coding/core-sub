import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { usePE } from "../context";
import { useCore } from "../../context";

export const PEContentDeselectButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>((props, ref) => {
  const { t } = useCore();
  const {
    state: { selected },
    setState,
  } = usePE();

  const handleDeselect = () => setState((s) => ({ ...s, selected: [] }));

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Tooltip title={t("Deselect")}>
          <IconButton
            ref={ref}
            size="small"
            {...props}
            onClick={handleDeselect}
          >
            <FontAwesomeIcon icon={["far", "xmark"]} />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );
});
