import * as React from "react";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { usePE } from "../context";
import { useCore } from "../../context";
import { PickIcon } from "../../PickIcon";

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
            color="inherit"
          >
            <PickIcon icon={"xmark"} />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );
});
