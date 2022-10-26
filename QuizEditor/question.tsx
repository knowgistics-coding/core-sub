import { useEffect, useState } from "react";
import { Panel } from "./panel";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { useQEC } from "./context";
import { useCore } from "../context";
import update from "react-addons-update";
import { StockImageTypes, StockPicker } from "../StockPicker";
import { StockDisplayImageTypes } from "../StockDisplay";
import { QDImgDisplay } from "./img";
import { Absatz } from "../Absatz";
import { PickIcon } from "../PickIcon";

export const Question = () => {
  const { t } = useCore();
  const { open, data, setData, onTabOpen } = useQEC();
  const [o, setO] = useState(false);

  const handleChangeQType = ({
    target: { value },
  }: SelectChangeEvent<string>) => {
    setData((d) => update(d, { question: { type: { $set: value } } }));
  };
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
      setData((d) => update(d, { question: { image: { $set: image } } }));
    }
  };
  const handleChangeParagraph = (value: string) => {
    setData((d) => update(d, { question: { paragraph: { $set: value } } }));
  };

  useEffect(() => {
    if (!data?.question) {
      setData((d) => ({ ...d, question: { type: "paragraph" } }));
    }
  }, [data?.question, setData]);

  return data?.question ? (
    <Panel
      expanded={open["question"]}
      title={t("Question")}
      onChange={onTabOpen("question")}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
        <FormControl>
          <InputLabel>{t("Type")}</InputLabel>
          <Select
            size="small"
            label={t("Type")}
            value={data?.question?.type || "paragraph"}
            onChange={handleChangeQType}
          >
            <MenuItem value="paragraph">{t("Paragraph")}</MenuItem>
            <MenuItem value="image">{t("Image")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {(() => {
        switch (data.question.type) {
          case "image":
            return (
              <Box textAlign="center">
                {data.question.image && (
                  <Box mb={2}>
                    <QDImgDisplay id={data.question.image._id} />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  startIcon={<PickIcon icon={"folder-open"} />}
                  onClick={() => setO(true)}
                >
                  {t("Browse")}
                </Button>
                <StockPicker
                  open={o}
                  onClose={() => setO(false)}
                  onConfirm={handleChangeImage}
                />
              </Box>
            );
          default:
            return (
              <Absatz
                value={data.question.paragraph}
                onChange={handleChangeParagraph}
              />
            );
        }
      })()}
    </Panel>
  ) : (
    <div></div>
  );
};
