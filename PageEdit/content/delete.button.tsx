import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";
import { useCore } from "../../context";
import React from "react";
import update from "react-addons-update";
import { PageContentTypes, usePE } from "../context";
import { usePopup } from "components/core-sub/react-popup";

export const PEContentDeleteButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { t } = useCore();
  const {
    state: { selected },
    setState,
    setData,
  } = usePE();
  const { Popup } = usePopup();

  const handleRemove = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("DoYouWantToRemove", { name: t("Selected") }),
      icon: "trash",
      onConfirm: () => {
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
      },
    });
  };

  return (
    <React.Fragment>
      {selected.length > 0 && (
        <Button
          variant="contained"
          disableElevation
          startIcon={<FontAwesomeIcon icon={["far", "trash"]} />}
          color="error"
          ref={ref}
          {...props}
          onClick={handleRemove}
        >
          {t("Remove$Name", { name: t("Selected") })}
        </Button>
      )}
    </React.Fragment>
  );
});
