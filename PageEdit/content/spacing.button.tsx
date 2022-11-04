import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useCore } from "../../context";
import { PickIcon } from "../../PickIcon";
import { usePE } from "../context";
import { PanelSpacing } from "../panels/spacing";

export const PEContentSpacingButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>((_props, ref) => {
  const { t } = useCore();
  const [open, setOpen] = useState<boolean>(false);
  const {
    data,
    setData,
    state: { selected },
  } = usePE();

  const handleOpen = (open: boolean) => () => setOpen(open);
  const handleChangeSpacing = (top: number, bottom: number) => {
    setData(data.contentSpaceBatch(selected, top, bottom));
    setOpen(false);
  };

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Tooltip title={t("Edit $Name", { name: t("Spacing") })}>
          <IconButton
            size="small"
            ref={ref}
            onClick={handleOpen(true)}
            color="inherit"
          >
            <PickIcon icon={"arrows-v"} />
          </IconButton>
        </Tooltip>
      )}
      <PanelSpacing
        open={open}
        onClose={handleOpen(false)}
        onChange={handleChangeSpacing}
      />
    </React.Fragment>
  );
});
