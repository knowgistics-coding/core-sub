import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Stack, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useCore } from "../context";
import { SlideshowSlide } from "../Controller/slideshow";
import { DialogCompact } from "../DialogCompact";
import { KuiButton } from "../KuiButton";
import { StockDisplay } from "../StockDisplay";
import { StockImageCtrl, StockImageTypes, StockPicker } from "../StockPicker";

export type SlideshowEditProps = {
  open: boolean;
  onClose: () => void;
  onChange: (value: SlideshowSlide) => void;
  slide?: SlideshowSlide | null;
};
export const SlideshowEdit = (props: SlideshowEditProps) => {
  const { t } = useCore();
  const [state, setState] = useState<{
    picker: boolean;
    data: SlideshowSlide;
  }>({
    picker: false,
    data: new SlideshowSlide(),
  });

  const handleOpen = (value: boolean) => () =>
    setState((s) => ({ ...s, picker: value }));

  const handleChange =
    <T extends "title" | "desc" | "feature">(field: T) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setState((s) => ({
        ...s,
        data: s.data.set(field, value as SlideshowSlide[T]),
      }));
    };
  const handleChangeFeature = (images: StockImageTypes[]) => {
    if (Array.isArray(images) && images.length > 0) {
      const image = new StockImageCtrl(images[0]).toDisplay();
      setState((s) => ({ ...s, data: s.data.set("feature", image) }));
    }
  };
  const handleConfirm = () => props.onChange(state.data);

  useEffect(() => {
    if (props.open && props.slide) {
      setState((s) => ({ ...s, data: new SlideshowSlide(props.slide!) }));
    }
  }, [props.open, props.slide]);

  return (
    <>
      <DialogCompact
        icon="edit"
        open={Boolean(props.slide)}
        onClose={props.onClose}
        title={t("Edit")}
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={["far", "image"]} />}
              onClick={handleOpen(true)}
            >
              {t("Browse $Name", { name: t("Image") })}
            </Button>
            <Box flex={1} />
            <KuiButton tx="confirm" onClick={handleConfirm} />
          </>
        }
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            autoFocus
            label={t("Title")}
            value={state.data.title}
            onChange={handleChange("title")}
          />
          <TextField
            fullWidth
            label={t("Description")}
            rows={3}
            multiline
            value={state.data.desc}
            onChange={handleChange("desc")}
          />
          {state.data.feature && (
            <StockDisplay ratio={2 / 3} {...state.data.feature} />
          )}
        </Stack>
      </DialogCompact>
      <StockPicker
        open={state.picker}
        onClose={handleOpen(false)}
        onConfirm={handleChangeFeature}
      />
    </>
  );
};
