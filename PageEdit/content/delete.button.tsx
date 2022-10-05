import { IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { useCore } from "../../context";
import React from "react";
import { usePE } from "../context";
import { usePopup } from "../../Popup";
import { PickIcon } from "../../PickIcon";

export const PEContentDeleteButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>((props, ref) => {
  const { t } = useCore();
  const {
    state: { selected },
    setState,
    setData,
    pageData,
  } = usePE();
  const { Popup } = usePopup();

  const handleRemove = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Selected") }),
      icon: "trash",
      onConfirm: () => {
        setData(pageData.content.remove(selected).toJSON());
        setState((s) => ({ ...s, selected: [] }));
      },
    });
  };

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Tooltip title={t("Remove $Name", { name: t("Selected") })}>
          <IconButton
            size="small"
            ref={ref}
            {...props}
            onClick={handleRemove}
            color="inherit"
          >
            <PickIcon icon={"trash"} />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );
});
