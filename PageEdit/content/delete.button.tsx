import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";
import React, { useState } from "react";
import update from "react-addons-update";
import { DialogRemove } from "../../DialogRemove";
import { PageContentTypes, usePE } from "../context";

export const PEContentDeleteButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    state: { selected },
    setState,
    setData,
  } = usePE();

  const handleOpen = (open: boolean) => () => setOpen(open);
  const handleRemove = () => {
    setData((d) =>
      update(d, {
        contents: {
          $apply: (contents: PageContentTypes[]) => {
            return contents.filter(
              (content) => !selected.includes(content.key)
            );
          },
        },
      })
    );
    setState((s) => ({ ...s, selected: [] }));
    setOpen(false);
  };

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Button
          variant="contained"
          disableElevation
          startIcon={<FontAwesomeIcon icon={["fad", "trash"]} />}
          color="error"
          ref={ref}
          {...props}
          onClick={handleOpen(true)}
        >
          Remove item(s)
        </Button>
      )}
      <DialogRemove
        open={open}
        label="Do you want to remove selected item(s)?"
        onClose={handleOpen(false)}
        onConfirm={handleRemove}
      />
    </React.Fragment>
  );
});
