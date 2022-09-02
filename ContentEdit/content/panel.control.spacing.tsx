import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { KuiButton } from "../../KuiButton";

interface dataTypes {
  top: number;
  bottom: number;
}
interface DialogChangeSpacingProps extends dataTypes {
  open: boolean;
  onClose: () => void;
  onConfirm: (top: number, bottom: number) => void;
}

const Reset = (props: IconButtonProps) => (
  <IconButton size="small" {...props}>
    <FontAwesomeIcon icon={["fad", "redo"]} size="xs" />
  </IconButton>
);

const defaultData: dataTypes = { top: 0, bottom: 3 };

export const DialogChangeSpacing = ({
  top,
  bottom,
  open,
  onClose,
  onConfirm,
}: DialogChangeSpacingProps) => {
  const [data, setData] = useState<dataTypes>({ ...defaultData });

  const handleChange = (key: string) => (_e: Event, n: number | number[]) =>
    setData((d) => ({ ...d, [key]: Array.isArray(n) ? n[0] : n }));

  const handleReset = (key: "top" | "bottom") => () =>
    setData((d) => ({ ...d, [key]: defaultData[key] }));

  const handleConfirm = () => {
    onClose();
    onConfirm(data.top, data.bottom);
  };

  useEffect(() => {
    if (open) {
      setData((d) => ({ ...d, top, bottom }));
    }
  }, [open, top, bottom]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Spacing</DialogTitle>
      <DialogContent>
        <Box pt={2} />
        <Typography variant="caption">Top</Typography>
        <Stack spacing={1} direction="row" sx={{ mb: 2 }}>
          <Slider
            aria-label="spacing top"
            min={0}
            max={20}
            value={data.top}
            onChange={handleChange("top")}
            valueLabelDisplay="auto"
          />
          <Reset onClick={handleReset("top")} />
        </Stack>
        <Typography variant="caption">Bottom</Typography>
        <Stack spacing={1} direction="row">
          <Slider
            aria-label="spacing bottom"
            min={0}
            max={20}
            value={data.bottom}
            onChange={handleChange("bottom")}
            valueLabelDisplay="auto"
          />
          <Reset onClick={handleReset("bottom")} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <KuiButton tx="confirm" onClick={handleConfirm} />
        <KuiButton tx="close" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};
