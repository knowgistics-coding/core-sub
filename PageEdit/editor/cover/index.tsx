import {
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import update from "react-addons-update";
import { useCore } from "../../../context";
import { DialogImagePosition } from "../../../DialogImagePosition";
import { PickIcon } from "../../../PickIcon";
import { StockDisplay, StockDisplayProps } from "../../../StockDisplay";
import { StockImageTypes, StockPicker } from "../../../StockPicker";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";

const Root = styled(Box)({
  position: "relative",
});

const ChangeButton = styled(Button)({
  position: "absolute",
  backgroundColor: "white",
  bottom: 8,
  left: 8,
  "&:hover": {
    backgroundColor: "white",
  },
});

export const PEEditorCover = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const { setData } = usePE();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleOpen = (key: string, value: boolean) => () =>
    setOpen((o) => ({ ...o, [key]: value }));
  const handleChangeImage = ([stockimage]: StockImageTypes[]) => {
    if (stockimage) {
      const { _id, blurhash, width, height } = stockimage;
      const image = { _id, blurhash, width, height };
      setData((d) =>
        update(d, {
          contents: {
            [index]: {
              cover: {
                $apply: (cover?: StockDisplayProps) =>
                  cover ? { ...cover, image } : { image },
              },
            },
          },
        })
      );
    }
  };
  const handleChangePos = (pos: { top: string; left: string }) => {
    setData((d) =>
      update(d, { contents: { [index]: { cover: { pos: { $set: pos } } } } })
    );
  };

  return (
    <PEPanel
      content={content}
      index={index}
      contentKey={content.key}
      noContainer
      actions={
        <React.Fragment>
          {content?.cover?.image && (
            <ListItemButton onClick={handleOpen("pos", true)}>
              <ListItemIcon>
                <PickIcon icon={"arrows"} />
              </ListItemIcon>
              <ListItemText primary={t("Position")} />
            </ListItemButton>
          )}
        </React.Fragment>
      }
    >
      <Root>
        <StockDisplay {...content?.cover} size="large" ratio={1 / 4} />
        <ChangeButton
          variant="outlined"
          startIcon={<PickIcon icon={"folder-open"} />}
          onClick={handleOpen("stock", true)}
        >
          {t("Browse")}
        </ChangeButton>
      </Root>
      <StockPicker
        open={Boolean(open.stock)}
        onClose={handleOpen("stock", false)}
        onConfirm={handleChangeImage}
      />
      {content?.cover?.image && (
        <DialogImagePosition
          image={content.cover.image}
          value={content.cover?.pos}
          open={Boolean(open.pos)}
          onClose={handleOpen("pos", false)}
          onSave={handleChangePos}
          cover
        />
      )}
    </PEPanel>
  );
};
