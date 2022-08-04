import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";
import { useCore } from "components/core-sub/context";
import React, { useState } from "react";
import update from "react-addons-update";
import { usePE } from "../context";
import { PanelSpacing } from "../panels/spacing";

export const PEContentSpacingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { t } = useCore()
  const [open, setOpen] = useState<boolean>(false);
  const {
    data,
    setData,
    state: { selected },
  } = usePE();

  const handleOpen = (open: boolean) => () => setOpen(open);
  const handleChangeSpacing = (top: number, bottom: number) => {
    selected.forEach((key) => {
      const index = data.contents?.findIndex((c) => c.key === key);
      if (typeof index === "number") {
        setData((d) =>
          update(d, {
            contents: { [index]: { $merge: { mt: top, mb: bottom } } },
          })
        );
      }
    });
    setOpen(false);
  };

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Button
          variant="contained"
          disableElevation
          startIcon={<FontAwesomeIcon icon={["far", "arrows-v"]} />}
          ref={ref}
          {...props}
          onClick={handleOpen(true)}
        >
          {t("Edit$Name", {name:t("Spacing")})}
        </Button>
      )}
      <PanelSpacing
        open={open}
        onClose={handleOpen(false)}
        onChange={handleChangeSpacing}
      />
    </React.Fragment>
  );
});
