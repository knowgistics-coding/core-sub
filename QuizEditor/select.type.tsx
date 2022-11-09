import React, { Fragment, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { TypeTypes } from "./context";
import { useCore } from "../context";
import { StockImageTypes, StockPicker } from "../StockPicker";
import { StockDisplayImageTypes } from "../StockDisplay";
import { QDImgDisplay } from "./img";
import { Absatz } from "../Absatz";
import { PickIcon } from "../PickIcon";
import { QuestionData } from "../Controller";

interface SelectTypeProps {
  type: TypeTypes;
  image?: StockDisplayImageTypes;
  paragraph?: string;
  onChange?: (option: Omit<QuestionData, "key">) => void;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}
export const SelectType = ({
  type,
  image,
  paragraph,
  onChange,
  title,
  actions,
}: SelectTypeProps) => {
  const { t } = useCore();
  const [open, setOpen] = useState<boolean>(false);

  const handleChangeType = ({
    target: { value },
  }: SelectChangeEvent<TypeTypes>) =>
    onChange?.({ type: value as QuestionData["type"], image, paragraph });
  const handleChangeImage = ([img]: StockImageTypes[]) => {
    if (img) {
      const { blurhash, _id, width, height, credit } = img;
      const image: StockDisplayImageTypes = {
        blurhash,
        _id,
        width,
        height,
        credit,
      };
      onChange?.({ type, image, paragraph });
    }
  };
  const handleChangeParagraph = (value: string) => {
    onChange?.({ type, image, paragraph: value });
  };

  return (
    <Fragment>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1}>
          {title && (
            <Typography variant="body1">
              <strong>{title}</strong>
            </Typography>
          )}
          {actions}
        </Stack>
        <Box flex={1} />
        <FormControl>
          <InputLabel>{t("Type")}</InputLabel>
          <Select
            label={t("Type")}
            size="small"
            value={["paragraph", "image"].includes(type) ? type : "paragraph"}
            onChange={handleChangeType}
          >
            <MenuItem value="paragraph">{t("Paragraph")}</MenuItem>
            <MenuItem value="image">{t("Image")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {(() => {
        switch (type) {
          case "image":
            return (
              <Box textAlign="center">
                {image?._id && (
                  <Box mb={2}>
                    <QDImgDisplay id={image?._id} />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  startIcon={<PickIcon icon={"folder-open"} />}
                  onClick={() => setOpen(true)}
                >
                  Browse
                </Button>
                <StockPicker
                  open={open}
                  onClose={() => setOpen(false)}
                  onConfirm={handleChangeImage}
                />
              </Box>
            );
          default:
            return (
              <Absatz value={paragraph} onChange={handleChangeParagraph} />
            );
        }
      })()}
    </Fragment>
  );
};
