import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useCore } from "../context";
import { KuiActionIcon } from "../KuiActionIcon";
import { DialogPopup } from "../DialogPopup";
import { KuiButton } from "../KuiButton";
import { useEffect, useState } from "react";

export type VisibilityDisplayValue = "public" | "private";
export type VisibilityEditProps = {
  disableDivider?: boolean;
  value?: VisibilityDisplayValue;
  onChange: (value: VisibilityDisplayValue) => void;
};
export const VisibilityEdit = (props: VisibilityEditProps) => {
  const { t } = useCore();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<VisibilityDisplayValue>("private");

  useEffect(() => {
    if (props.value && open) {
      setValue(props.value);
    } else {
      setValue("private");
    }
  }, [props.value, open]);

  return (
    <>
      <List>
        <ListItem divider={!Boolean(props.disableDivider)}>
          <ListItemText
            primary={t("Visibility")}
            secondary={props.value === "public" ? t("Public") : t("Private")}
            primaryTypographyProps={{
              variant: "caption",
              color: "textSecondary",
            }}
            secondaryTypographyProps={{
              variant: "body1",
              color: "textPrimary",
            }}
          />
          <ListItemSecondaryAction>
            <KuiActionIcon tx="edit" onClick={() => setOpen(true)} />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <DialogPopup
        open={open}
        title={t("Visibility")}
        icon="edit"
        actions={
          <KuiButton
            tx="confirm"
            variant="contained"
            size="large"
            onClick={() => {
              props.onChange(value);
              setOpen(false);
            }}
          />
        }
        onClose={() => setOpen(false)}
      >
        <FormControl fullWidth>
          <InputLabel>{t("Visibility")}</InputLabel>
          <Select
            label={t("Visibility") + "A"}
            value={value}
            onChange={({ target: { value } }) =>
              setValue(value as VisibilityDisplayValue)
            }
          >
            <MenuItem value="" disabled>
              -- {t("Select $Name", { name: t("Visibility") })} --
            </MenuItem>
            <MenuItem value="private">{t("Private")}</MenuItem>
            <MenuItem value="public">{t("Public")}</MenuItem>
          </Select>
        </FormControl>
      </DialogPopup>
    </>
  );
};
