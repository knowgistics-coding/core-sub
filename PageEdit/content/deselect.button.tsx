import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";

import { usePE } from "../context";
import { useCore } from "components/core-sub/context";

export const PEContentDeselectButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
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
        <Button
          variant="contained"
          disableElevation
          startIcon={<FontAwesomeIcon icon={["fad", "square"]} />}
          ref={ref}
          color="neutral"
          {...props}
          onClick={handleDeselect}
        >
          {t("Deselect")}
        </Button>
      )}
    </React.Fragment>
  );
});
