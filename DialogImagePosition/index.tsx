import { Grid, Slide, SlideProps, styled } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { KuiButton } from "../KuiButton";
import { Slider } from "./slider";
import { StockDisplay, StockDisplayImageTypes } from "../StockDisplay";
import { useCore } from "../context";
import { DialogCompact } from "../DialogCompact";

const Item = styled(Grid)({});
Item.defaultProps = {
  item: true,
  xs: 12,
  sm: 6,
};

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
  const { t } = useCore();
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
    <DialogCompact
      maxWidth="sm"
      open={props.open}
      onClose={props.onClose}
      componentProps={{
        dialog: {
          TransitionComponent: Slide,
          TransitionProps: { direction: "right" } as SlideProps,
        },
      }}
      title={t("Composition")}
      actions={<KuiButton tx="confirm" onClick={handleSave} />}
    >
      <Grid container spacing={2} alignItems={"center"}>
        {props.cover ? (
          <Fragment>
            <Item>
              <StockDisplay image={props.image} ratio={1 / 4} pos={pos} />
            </Item>
            <Item>
              <StockDisplay image={props.image} ratio={1} pos={pos} />
            </Item>
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
        <Item>
          <Slider
            label={t("Horizontal")}
            value={parseInt(pos.left)}
            onChange={handleChange("left")}
          />
        </Item>
        <Item>
          <Slider
            label={t("Vertical")}
            value={parseInt(pos.top)}
            onChange={handleChange("top")}
          />
        </Item>
      </Grid>
    </DialogCompact>
  ) : null;
};
