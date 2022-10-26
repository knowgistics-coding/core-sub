import { Box, Button, Typography } from "@mui/material";
import { Container } from "../Container";
import { useMC } from "./ctx";
import React from "react";
import { useCore } from "../context";
import { To, useNavigate } from "react-router-dom";
import { PickIcon, PickIconName } from "../PickIcon";

export interface RestrictProps {
  message?: React.ReactNode;
  icon?: PickIconName;
  link?: To;
}
export const MCRestrict = (props: RestrictProps) => {
  const { t } = useCore();
  const { dense } = useMC();
  const nav = useNavigate();

  return (
    <Container maxWidth="xs">
      <Box py={dense ? 6 : 0} textAlign={"center"}>
        <PickIcon icon={props.icon || "ban"} size="8x" />
        <Typography mt={2} color="textSecondary">
          {props.message || "You don't have permission to view this page"}
        </Typography>
        {props.link && (
          <Button
            variant="outlined"
            color="info"
            sx={{ mt: 4 }}
            startIcon={<PickIcon icon={"chevron-left"} />}
            onClick={() => nav(props.link!)}
          >
            {t("Back")}
          </Button>
        )}
      </Box>
    </Container>
  );
};
