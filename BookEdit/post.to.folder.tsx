import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useCore } from "../context";
import { KuiButton } from "../KuiButton";
import { useBookEdit } from ".";
import { genKey } from "draft-js";

export type PostAddType = {
  open: boolean;
  onClose: () => void;
};

export const AddToFolder = (props: PostAddType) => {
  const { t } = useCore();
  const { data, setData, state, setState } = useBookEdit();
  const [value, setValue] = useState("");

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    setValue(value);
  };
  const handleConfirm = () => {
    const FolderIndex = data?.contents?.findIndex((c) => c.key === value);
    const PostIndex = data?.contents?.findIndex((c) => c.key === state.MoveID);
    if (
      typeof PostIndex === "number" &&
      PostIndex > -1 &&
      data?.contents?.[PostIndex] &&
      typeof FolderIndex === "number" &&
      FolderIndex > -1 &&
      data?.contents?.[FolderIndex]
    ) {
      const item = Object.assign({}, data.contents[PostIndex], {
        key: genKey(),
      });
      if (item) {
        setData(data.pushToFolder(FolderIndex, PostIndex));
        setState((s) => ({ ...s, MoveID: "" }));
      }
    }
  };

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={props.open} onClose={props.onClose}>
        <DialogTitle>{t("Add to $Name", { name: t("Folder") })}</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            variant="outlined"
            displayEmpty
            value={value}
            onChange={handleChange}
          >
            <MenuItem value="">-- เลือก Folder --</MenuItem>
            {(data?.contents || [])
              .filter((c) => c.type === "folder")
              .map((content) => (
                <MenuItem key={content.key} value={content.key}>
                  {content.title}
                </MenuItem>
              ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <KuiButton
            tx="confirm"
            disabled={!Boolean(value)}
            onClick={handleConfirm}
          />
          <KuiButton tx="close" onClick={props.onClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};
