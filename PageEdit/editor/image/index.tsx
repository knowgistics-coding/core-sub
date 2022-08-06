import { useState } from "react";
import { PEPanel } from "../../panel";
import { StockImageTypes, StockPicker } from "../../../StockPicker";
import { PEEditorProps } from "../heading/index";
import { ImageContainer } from "./img.container";
import { Box, Button, styled } from "@mui/material";
import { useCore } from "../../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StockDisplay, StockDisplayProps } from "../../../StockDisplay";
import { PageDocument, usePE } from "../../context";
import update from "react-addons-update";
import { LinkUrl, ListItemURL } from "./link.url";
import { useDialog } from "../../dialog.manager";
import { MenuListItem } from "../../menu.list.item";

const BrowseButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  background: "white",
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  "&:hover": {
    background: "white",
  },
}));

const BoxAbsolute = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

const updateData = (
  d: PageDocument,
  index: number,
  data: {
    [key in keyof StockDisplayProps["image"]]?: StockDisplayProps["image"][key];
  }
): PageDocument => {
  return update(d, {
    contents: {
      [index]: {
        image: {
          $apply: (image: StockDisplayProps["image"]) =>
            image ? { ...image, ...data } : { ...data },
        },
      },
    },
  });
};

export const PEEditorImage = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const { setData } = usePE();
  const [open, setOpen] = useState<boolean>(false);
  const { setOpen: setDialogOpen } = useDialog();

  const handleChangeImage = ([image]: StockImageTypes[]) => {
    if (image) {
      const { blurhash, _id, width, height, credit } = image;
      const ratio = width && height ? height / width : undefined;
      const newImage: StockDisplayProps["image"] = {
        blurhash,
        _id,
        width,
        height,
        credit,
      };
      setData((d) => updateData(d, index, { image: newImage, ratio }));
    }
  };
  const handleChangeURL = (url: string) =>
    setData((d) =>
      updateData(d, index, {
        url: url.includes("http") ? url : `https://${url}`,
      })
    );

  return (
    <LinkUrl value={content.image?.url} onConfirm={handleChangeURL}>
      <PEPanel
        content={content}
        contentKey={content.key}
        index={index}
        actions={
          <>
            <ListItemURL />
            <MenuListItem
              icon={"crop"}
              primary={t("Ratio")}
              onClick={() => setDialogOpen(content.key, "image_ratio", true)}
            />
            <MenuListItem
              icon={"arrows"}
              primary={t("Composition")}
              onClick={() => setDialogOpen(content.key, "image_pos", true)}
            />
          </>
        }
      >
        <StockPicker
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={handleChangeImage}
        />
        <ImageContainer ratio={content.image?.ratio}>
          <BoxAbsolute>
            <StockDisplay ratio={9 / 16} {...content?.image} size="large" />
          </BoxAbsolute>
          <BrowseButton
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={["far", "folder-open"]} />}
            onClick={() => setOpen(true)}
            color="info"
          >
            {t("Browse")}
          </BrowseButton>
        </ImageContainer>
      </PEPanel>
    </LinkUrl>
  );
};
