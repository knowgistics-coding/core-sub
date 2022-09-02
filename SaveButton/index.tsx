import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, List, ListItem } from "@mui/material";
import { useCore } from "../context";

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
            <FontAwesomeIcon
              icon={["fad", loading ? "spinner" : "save"]}
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
