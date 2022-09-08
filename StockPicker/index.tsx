import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import update from "react-addons-update";
import { useCore } from "../context";
import { KuiButton } from "../KuiButton";
import { SPContent } from "./content";
import { StockPickerProps, SPContext, StateTypes } from "./context";
import { StockImageController, StockImageTypes } from "./controller";
import { SPUpload } from "./image.upload";
import { SPRemove } from "./remove";
import { FromURL } from "./url";

export * from "./controller";

/**
 * {@link https://github.com/knowgistics-coding/ts-core/blob/main/src/StockPicker/Readme.md Demo}
 */
export const StockPicker = ({
  open,
  onClose,
  onConfirm,
  multiple,
}: StockPickerProps) => {
  const { t, user } = useCore();
  const [control, setControl] = useState<StockImageController>();
  const [state, setState] = useState<StateTypes>({
    loading: true,
    docs: [],
    selected: [],
    uploadqueue: [],
  });

  const handleConfirm = () => {
    if (state.selected.length) {
      const docs = state.selected
        .map((id) => state.docs.find((doc) => doc._id === id) || null)
        .filter((doc) => doc) as StockImageTypes[];
      onConfirm(docs);
    }
    setState((s) => ({ ...s, selected: [] }));
    onClose();
  };
  const handleChangeURL = (data: StockImageTypes) => {
    const index = state.docs.findIndex((doc) => doc.md5 === data.md5);
    if (index > -1) {
      setState((s) =>
        update(s, {
          docs: { [index]: { $merge: { datemodified: new Date() } } },
        })
      );
    } else {
      setState((s) => ({ ...s, docs: s.docs.concat(data) }));
    }
  };

  useEffect(() => {
    if (user.loading === false && user.data && open) {
      const control = new StockImageController(user.data);
      setControl(control);
      control
        .getMy()
        .then((docs) => setState((s) => ({ ...s, docs, loading: false })));
    }
  }, [open, user]);

  return (
    <SPContext.Provider
      value={{
        multiple,
        control,
        state,
        setState,
      }}
    >
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>
          {state.selected.length > 0
            ? `Select ${state.selected.length} image(s)`
            : t("Change $Name", { name: t("Image") })}
        </DialogTitle>
        <DialogContent>
          {state.loading ? (
            <Box display="flex" sx={{ justifyContent: "center" }}>
              <CircularProgress size={64} thickness={4} />
            </Box>
          ) : (
            <SPContent />
          )}
        </DialogContent>
        <DialogActions>
          <SPUpload />
          <FromURL onConfirm={handleChangeURL} />
          <SPRemove />
          <Box flex={1} />
          <KuiButton
            tx="confirm"
            disabled={state.selected.length < 1}
            onClick={handleConfirm}
          />
          <KuiButton tx="close" onClick={onClose} />
        </DialogActions>
      </Dialog>
    </SPContext.Provider>
  );
};
