import { useEffect } from "react";
import { ImageDisplay, ImageDisplayProps } from "../../ImageDisplay";
import { useCE } from "../ctx";
import { imageTypes } from "../ctx.d";
import update from "react-addons-update";
import { CEPanel } from "./panel";
import { cleanObject } from "../../func";
import { Button, ButtonProps, styled } from "@mui/material";
import { useCore } from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { grey } from "@mui/material/colors";
import { ImagePicker } from "../../ImagePicker";
import { ImageDataMongoTypes } from "../../skeleton.controller";

const EditButton = styled(
  (props: Omit<ButtonProps, "variant" | "startIcon" | "children">) => {
    const { t } = useCore();
    return (
      <Button
        variant="contained"
        color="light"
        startIcon={<FontAwesomeIcon icon={["fad", "edit"]} />}
        {...props}
      >
        {t("Change")}
      </Button>
    );
  }
)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(2),
  left: theme.spacing(2),
}));

interface PlaceHolderProps {
  ratio: number;
}
const PlaceHolder = styled("div", {
  shouldForwardProp: (prop) => prop !== "ratio",
})<PlaceHolderProps>(({ ratio }) => ({
  backgroundColor: grey[200],
  "&:after": {
    content: "''",
    display: "block",
    paddingTop: `calc(100% * ${ratio})`,
  },
}));

export interface CEImagePanelProps {
  content: imageTypes;
  index: number;
}

export const CEImagePanel = ({ content, index }: CEImagePanelProps) => {
  const { getContentIndex, setData, post } = useCE();

  const handleChangeImage = (images: ImageDataMongoTypes[]) => {
    if (images.length) {
      const {
        blurhash,
        content: { thumbnail, original },
        _id,
      } = images[0];
      const newImage: ImageDisplayProps["image"] = {
        blurhash,
        thumbnail,
        original,
        id: _id,
      };
      if (content?.value?.image) {
        setData((d) =>
          update(d, {
            contents: { [index]: { value: { image: { $set: newImage } } } },
          })
        );
      } else {
        setData((d) =>
          update(d, {
            contents: { [index]: { $merge: { value: { image: newImage } } } },
          })
        );
      }
    }
  };

  useEffect(() => {
    if (content.value && !Boolean(content.value?.image)) {
      const { blurhash, id, medium, original, thumbnail } = content.value;
      const pos = content?.pos
        ? { left: `${content?.pos.left}%`, top: `${content?.pos.top}%` }
        : undefined;
      const ratio = content?.ratio
        ? Number(content?.ratio.height) / Number(content?.ratio.width)
        : undefined;
      const index = getContentIndex(content.key);
      if (index > -1) {
        setData((d) =>
          cleanObject(
            update(d, {
              contents: {
                [index]: {
                  value: {
                    $set: {
                      image: { blurhash, id, medium, original, thumbnail },
                      pos,
                      ratio,
                    },
                  },
                  pos: { $set: undefined },
                  ratio: { $set: undefined },
                },
              },
            })
          )
        );
      }
    }
  }, [content, getContentIndex, setData]);

  return (
    <CEPanel
      maxWidth={post ? "post" : undefined}
      contentKey={content.key}
      index={index}
    >
      {!Boolean(content?.value?.image) ? (
        <PlaceHolder ratio={content?.value?.ratio || 0.5625} />
      ) : (
        <ImageDisplay
          image={content.value?.image}
          ratio={content?.value?.ratio}
          pos={content?.value?.pos}
        />
      )}
      <ImagePicker onConfirm={handleChangeImage}>
        <EditButton />
      </ImagePicker>
    </CEPanel>
  );
};
