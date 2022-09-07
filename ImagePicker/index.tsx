import { Box, Grid } from "@mui/material";
import { useCore } from "../context";
import { DialogCompact } from "../DialogCompact";
import { ImageItem } from "./image.item";

export const ImagePicker = (props: any) => {
  const { t } = useCore();

  return (
    <DialogCompact
      open={true}
      maxWidth="md"
      title={t("Choose$Name", { name: t("Image") })}
      icon="image"
      actions={
        <>
          123
          <Box flex={1} />
          456
        </>
      }
    >
      <Grid container spacing={2}>
        <ImageItem src="https://picsum.photos/200/300" />
        <ImageItem src="https://picsum.photos/200/300" />
        <ImageItem src="https://picsum.photos/200/300" />
        <ImageItem src="https://picsum.photos/200/300" />
      </Grid>
    </DialogCompact>
  );
};
