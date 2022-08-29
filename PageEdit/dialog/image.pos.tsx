import { Grid } from "@mui/material";
import { usePE } from "../context";
import { useDialog } from "../dialog.manager";
import { Slider } from "../../DialogImagePosition/slider";
import { useState } from "react";
import update from "react-addons-update";
import { useCore } from "../../context";
import { Fenster } from "../../Fenster";
import { KuiButton } from "../../KuiButton";
import { StockDisplay } from "../../StockDisplay";

export interface PosTypes {
  left: string;
  top: string;
}

export const DialogImagePosition = () => {
  const { t } = useCore();
  const { isOpen, setOpen, key } = useDialog();
  const {
    data: { contents },
    setData,
  } = usePE();
  const content = contents?.find((c) => c.key === key);

  const [pos, setPos] = useState<PosTypes>({
    left: "50%",
    top: "50%",
  });

  const handleChange = (key: string) => (n: number) =>
    setPos((s) => ({ ...s, [key]: `${n}%` }));
  const handleSave = () => {
    const index = contents?.findIndex((c) => c.key === key);
    if (typeof index === "number" && index > -1) {
      setData((d) => ({
        ...d,
        contents: update(d?.contents || [], {
          [index]: { image: { pos: { $set: pos } } },
        }),
      }));
      setOpen("", "image_pos", false);
    }
  };

  return (
    <Fenster
      title={t("Composition")}
      open={Boolean(isOpen("image_pos") && content)}
      onClose={() => setOpen("", "image_pos", false)}
      actions={<KuiButton tx="confirm" onClick={handleSave} />}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          {content?.image && (
            <StockDisplay {...content.image} pos={pos} />
          )}
        </Grid>
        <Grid item xs={12}>
          <Slider
            label={t("Horizontal")}
            value={parseInt(pos.left)}
            onChange={handleChange("left")}
          />
        </Grid>
        <Grid item xs={12}>
          <Slider
            label={t("Vertical")}
            value={parseInt(pos.top)}
            onChange={handleChange("top")}
          />
        </Grid>
      </Grid>
    </Fenster>
  );
};
