import {
  Box,
  Button,
  Grid,
  ListItem,
  ListItemProps,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ActionIcon } from "../ActionIcon";
import { useCore } from "../context";
import { ImageDisplay, ImageDisplayProps } from "../ImageDisplay";
import { FIEMove } from "./edit/move";
import { PosTypes } from "../DialogImagePosition";
import { KuiButton } from "../KuiButton";
import { StockImageTypes, StockPicker } from "../StockPicker";
import {
  StockDisplay,
  StockDisplayImageTypes,
  StockDisplayProps,
} from "../StockDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import update from "react-addons-update";
import { cleanObject } from "../func";

export interface FeatureImageProps extends Omit<ImageDisplayProps, "ratio"> {}
export const FeatureImage = ({ image, pos }: FeatureImageProps) => {
  const { isMobile } = useCore();
  return <ImageDisplay image={image} pos={pos} ratio={isMobile ? 1 : 1 / 4} />;
};

export interface FeatureImageEditProps {
  listItemProps?: ListItemProps;
  value?: StockDisplayProps | null;
  onChange: (data: StockDisplayProps) => void;
  onRemove: () => void;
}
export const FeatureImageEdit = ({
  listItemProps,
  value,
  onChange,
  onRemove,
}: FeatureImageEditProps) => {
  const { t } = useCore();
  const [mobile, setMobile] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleToggleMobile = () => setMobile((m) => !m);
  const handleChangePos = (pos: PosTypes) =>
    onChange(update(value || {}, { pos: { $set: pos } }));
  const handleChangeImage = ([img]: StockImageTypes[]) => {
    if (img) {
      const { blurhash, _id, width, height, credit } = img;
      const image: StockDisplayImageTypes = cleanObject({
        blurhash,
        _id,
        width,
        height,
        credit,
      }) as StockDisplayImageTypes;
      onChange(update(value || {}, { image: { $set: image } }));
    }
  };

  return (
    <ListItem divider {...listItemProps}>
      <Box display={"flex"} flexDirection={"column"} flex={1}>
        <Box display={"flex"} alignItems={"center"}>
          <Typography variant="caption" color="textSecondary">
            {t("FeatureImage")}
          </Typography>
          <Box flex={1} />
          {value && (
            <ActionIcon
              icon={mobile ? ["far", "mobile"] : ["far", "tv"]}
              onClick={handleToggleMobile}
            />
          )}
          {value?.image && (
            <FIEMove image={value.image} onChange={handleChangePos} />
          )}
        </Box>
        {value?.image && (
          <Box py={1}>
            <StockDisplay
              image={value?.image}
              pos={value?.pos}
              ratio={mobile ? 1 : 0.25}
            />
          </Box>
        )}
        <Box flex={1}>
          <Grid container spacing={1}>
            <Grid item xs={value?.image ? 6 : 12}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<FontAwesomeIcon icon={["far", "folder-open"]} />}
                color="info"
              >
                {t("Choose")}
              </Button>
              <StockPicker
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleChangeImage}
              />
            </Grid>
            {value?.image && (
              <Grid item xs={6} onClick={() => onRemove?.()}>
                <KuiButton fullWidth variant="outlined" tx="remove" />
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </ListItem>
  );
};
