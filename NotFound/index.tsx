import { Container } from "../Container";
import { Box, Button, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { PickIcon } from "../PickIcon";

export const NotFound = (props: { noButton?: boolean; to?: string }) => {
  const nav = useNavigate();

  return (
    <Box py={6}>
      <Container maxWidth="xs">
        <Box textAlign="center" flex={1}>
          <PickIcon size="6x" icon={"cactus"} style={{ color: green[500] }} />
          <Box mb={2} />
          <Typography
            variant="h1"
            style={{ lineHeight: 1 }}
            sx={{ color: "warning.main" }}
          >
            <strong>404</strong>
          </Typography>
          <Typography
            variant="h5"
            color="textSecondary"
            style={{ lineHeight: 1 }}
          >
            NOT FOUND
          </Typography>
          <Box mb={6} />
          {props.noButton ? null : (
            <Button
              variant="outlined"
              startIcon={<PickIcon icon={"chevron-left"} />}
              color="info"
              onClick={() => nav(props.to || "/")}
            >
              Go to HOME
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
