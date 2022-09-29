import { useState } from "react";
import { PEPanel } from "../../panel";
import { StockImageTypes, StockPicker } from "../../../StockPicker";
import { PEEditorProps } from "../heading/index";
import { ImageContainer } from "./img.container";
import { alpha, Box, Button, styled } from "@mui/material";
import { useCore } from "../../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StockDisplay, StockDisplayProps } from "../../../StockDisplay";
import { PageDocument, usePE } from "../../context";
import update from "react-addons-update";
import { useDialog } from "../../dialog.manager";
import { MenuListItem } from "../../menu.list.item";
import { usePopup } from "../../../Popup";

const BrowseButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  background: alpha(theme.palette.background.default, 0.75),
  bottom: theme.spacing(1),
  left: theme.spacing(1),
  WebkitBackdropFilter: 'blur(2px)',
  "&:hover": {
    background: theme.palette.background.default,
  },
}));

const BoxAbsolute = styled(Box)(({ theme }) => theme.mixins.absoluteFluid);

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
  const { Popup } = usePopup();

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
  const handleChangeURL = () => {
    Popup.prompt({
      title: t("Change $Name", { name: "URL" }),
      text: "URL",
      icon: "link",
      onConfirm: (value) => {
        if (value) {
          setData((d) =>
            updateData(d, index, {
              url: value.includes("http") ? value : `https://${value}`,
            })
          );
        }
      },
    });
  };
  const handleChangeRemoveURL = () => {
    Popup.remove({
      title: t("Remove $Name", { name: " URL" }),
      text: t("Do You Want To Remove $Name", { name: "URL" }),
      icon: "link-slash",
      onConfirm: () => {
        setData((d) => updateData(d, index, { url: null }));
      },
    });
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      actions={
        <>
          <MenuListItem
            icon={"link"}
            primary={t("Change $Name", { name: " URL" })}
            onClick={handleChangeURL}
          />
          {content.image?.url && (
            <MenuListItem
              icon={"link-slash"}
              primary={t("Remove $Name", { name: " URL" })}
              onClick={handleChangeRemoveURL}
            />
          )}
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
          {content?.image?.url && (
            <Box
              sx={(theme) => ({
                position: "absolute",
                bottom: 0,
                right: 0,
                ...theme.typography.caption,
                padding: theme.spacing(0, 0.5),
                backgroundColor: "#000A",
              })}
            >
              <FontAwesomeIcon
                icon={["far", "link"]}
                style={{ marginRight: "0.5rem" }}
              />
              {content.image.url}
            </Box>
          )}
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
  );
};
