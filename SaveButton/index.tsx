import { Button, List, ListItem } from "@mui/material";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";

export interface SaveButtonProps {
  loading?: boolean;
  onSave: () => void;
  disabled?: boolean;
}
export const SaveButton = ({ loading, onSave, disabled }: SaveButtonProps) => {
  const { t } = useCore();

  return (
    <List disablePadding>
      <ListItem divider>
        <Button
          fullWidth
          size="large"
          variant="contained"
          color="success"
          disableElevation
          startIcon={
            <PickIcon
              icon={loading ? "spinner" : "save"}
              pulse={Boolean(loading)}
            />
          }
          disabled={loading || disabled}
          onClick={onSave}
        >
          {loading ? t("Please Wait") : t("Save")}
        </Button>
      </ListItem>
    </List>
  );
};
