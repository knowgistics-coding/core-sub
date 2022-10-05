import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCore } from "../context";
import { PickIcon } from "../PickIcon";

export const ReactMaxAttemps = (props: { back: string }) => {
  const { t } = useCore();
  const nav = useNavigate();

  return (
    <Box textAlign={"center"}>
      <Typography variant="body1" color="error">
        {t("You've reached the maximum attempts")}
      </Typography>
      <Box mt={2}>
        <Button
          variant="outlined"
          startIcon={<PickIcon icon={"chevron-left"} />}
          color="neutral"
          onClick={() => nav(props.back)}
        >
          {t("Back")}
        </Button>
      </Box>
    </Box>
  );
};
