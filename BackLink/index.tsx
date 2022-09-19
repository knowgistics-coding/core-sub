import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, List, ListItem } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { useCore } from "../context";

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
          startIcon={<FontAwesomeIcon icon={["far", "chevron-left"]} />}
          target={target || "_self"}
          color="neutral"
        >
          {t("Back")}
        </Button>
      </ListItem>
    </List>
  );
});
