import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  SlideProps,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { KuiButton } from "../KuiButton";
import { Slider } from "./slider";
import { StockDisplay, StockDisplayImageTypes } from "../StockDisplay";

export interface PosTypes {
  left: string;
  top: string;
}
export interface DialogImagePositionProps {
  open: boolean;
  onSave: (pos: PosTypes) => void;
  onClose: () => void;
  image: StockDisplayImageTypes;
  value?: PosTypes;
  cover?: boolean;
  ratio?: number;
}
export const DialogImagePosition = (props: DialogImagePositionProps) => {
  const [pos, setPos] = useState<PosTypes>({
    left: "50%",
    top: "50%",
  });

  const handleChange = (key: string) => (n: number) =>
    setPos((s) => ({ ...s, [key]: `${n}%` }));
  const handleSave = () => {
    if (props.onSave && props.onClose) {
      props.onSave(pos);
      props.onClose();
    }
  };

  useEffect(() => {
    if (props.value) {
      setPos(props.value);
    }
  }, [props.open, props.value]);

  return props.image ? (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "right" } as SlideProps}
    >
      <DialogTitle>Image Composition</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} alignItems={"center"}>
          {props.cover ? (
            <Fragment>
              <Grid item xs={12} md={6}>
                <StockDisplay image={props.image} ratio={1 / 4} pos={pos} />
              </Grid>
              <Grid item xs={12} md={6}>
                <StockDisplay image={props.image} ratio={1} pos={pos} />
              </Grid>
            </Fragment>
          ) : (
            <Grid item xs={12}>
              <StockDisplay
                image={props.image}
                ratio={props.ratio || 1}
                pos={pos}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Slider
              label="Horizontal"
              value={parseInt(pos.left)}
              onChange={handleChange("left")}
            />
          </Grid>
          <Grid item xs={12}>
            <Slider
              label="Vertical"
              value={parseInt(pos.top)}
              onChange={handleChange("top")}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <KuiButton tx="save" onClick={handleSave} />
        <KuiButton tx="close" onClick={props.onClose} />
      </DialogActions>
    </Dialog>
  ) : null;
};
