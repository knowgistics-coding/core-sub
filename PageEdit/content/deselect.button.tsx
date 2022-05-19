import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";

import { usePE } from "../context";

export const PEContentDeselectButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
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
          Deselect
        </Button>
      )}
    </React.Fragment>
  );
});
