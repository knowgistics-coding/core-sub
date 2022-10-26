import { Button, List, ListItem } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { useCore } from "../context";
import { PickIcon } from "../PickIcon";

export interface BackLinkProps {
  to: string;
  target?: string;
  divider?: boolean;
}
export const BackLink = React.memo(({ divider, to, target }: BackLinkProps) => {
  const { t } = useCore();

  return (
    <List>
      <ListItem divider={Boolean(divider)}>
        <Button
          component={Link}
          to={to}
          startIcon={<PickIcon icon={"chevron-left"} />}
          target={target || "_self"}
          color="neutral"
        >
          {t("Back")}
        </Button>
      </ListItem>
    </List>
  );
});
