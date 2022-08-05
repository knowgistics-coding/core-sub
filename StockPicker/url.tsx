import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button } from "@mui/material";
import { useSP } from "./context";
import { StockImageTypes } from "./controller";
import { Fragment } from "react";
import { useCore } from "../context";
import { usePopup } from "../react-popup";

export const FromURL = (props: {
  onConfirm: (data: StockImageTypes) => void;
}) => {
  const { t } = useCore();
  const { control } = useSP();
  const { Popup } = usePopup();

  const handleConvert = () => {
    Popup.prompt({
      title: t("From URL"),
      text: "URL",
      icon: "link",
      onConfirm: async (value) => {
        if (value && control) {
          const file = await control.fromURL(value).catch((err) => {
            Popup.alert({
              title: t("Error"),
              text: err.message,
              icon: "exclamation-triangle",
            });
          });
          if (file) {
            const result = await control.upload(file).catch((err) => {
              Popup.alert({
                title: t("Error"),
                text: err.message,
                icon: "exclamation-triangle",
              });
            });
            if (result) {
              props.onConfirm(result);
            }
          }
        }
      },
    });
  };

  return (
    <Fragment>
      <Box ml={2} />
      <Button
        variant="outlined"
        startIcon={<FontAwesomeIcon icon={["far", "link"]} />}
        color="neutral"
        onClick={handleConvert}
      >
        {t("From URL")}
      </Button>
    </Fragment>
  );
};
