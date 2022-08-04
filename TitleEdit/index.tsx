import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useCore } from "../context";
import { KuiActionIcon } from "../KuiActionIcon";
import { usePopup } from "../react-popup";

export interface TitleEditProps {
  value?: string;
  onChange: (value: string) => void;
}
export const TitleEdit = ({ value, onChange }: TitleEditProps) => {
  const { t } = useCore();
  const { Popup } = usePopup();

  const handleEdit = () => {
    Popup.prompt({
      title: t("Edit$Name", { name: t("Title") }),
      text: t("Title"),
      icon: "edit",
      defaultValue: value,
      onConfirm: async (value) => {
        onChange(value || "");
      },
    });
  };

  return (
    <List disablePadding>
      <ListItem divider dense>
        <ListItemText
          primary={t("Title")}
          secondary={value || t("No Title")}
          primaryTypographyProps={{
            variant: "caption",
            color: "textSecondary",
          }}
          secondaryTypographyProps={{
            variant: "h6",
            color: Boolean(value) ? "textPrimary" : "textSecondary",
          }}
        />
        <ListItemSecondaryAction>
          <KuiActionIcon tx="edit" onClick={handleEdit} />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};
