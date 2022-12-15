import { Button, ButtonProps, ListItem, ListItemProps } from "@mui/material";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";

export const BackWState = ({
  onClick,
  ...props
}: ListItemProps & Pick<ButtonProps, "onClick">) => {
  const { t } = useCore();

  return (
    <ListItem divider {...props}>
      <Button
        startIcon={<PickIcon icon="chevron-left" />}
        color="neutral"
        onClick={onClick}
      >
        {t("Back")}
      </Button>
    </ListItem>
  );
};
