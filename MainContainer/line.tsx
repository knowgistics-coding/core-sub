import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  SlideProps,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useMC } from "./ctx";
import QRCode from "react-qr-code";
import { useCore } from "../context";
import { Link } from "react-router-dom";
import { PickIcon } from "../PickIcon";

export const MCLine = () => {
  const { onSettingChange } = useCore();
  const { user } = useMC();
  const [open, setOpen] = useState<boolean>(false);
  const line = null;

  const handleOpen = (open: boolean) => () => setOpen(open);
  const handleUnlink = () => onSettingChange?.("line", null);

  return (
    <Box display={"flex"} alignItems={"center"}>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen(true)}
        startIcon={<PickIcon icon={"link"} />}
      >
        {line ? "Change" : "Link"}
      </Button>
      {line && (
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={handleUnlink}
          startIcon={<PickIcon icon={"unlink"} />}
          style={{ marginLeft: "0.5rem" }}
        >
          Unlink
        </Button>
      )}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={handleOpen(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" } as SlideProps}
      >
        <DialogTitle>Line QRCode</DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <QRCode
              value={`https://line.me/R/oaMessage/@920ooxaj/?register:${user.data?.uid}`}
            />
            <Box mb={2} />
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to={`https://line.me/R/oaMessage/@920ooxaj/?register:${user.data?.uid}`}
              target="_blank"
              size="large"
              startIcon={<PickIcon icon={"link"} />}
            >
              Link
            </Button>
            <Box mb={2} />
            <Typography variant="caption">
              หากยังไม่เคยเพิ่มเพื่อนกรุณากดเพิ่มเพื่อนแล้วแสกน QR Code อีกครั้ง
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
