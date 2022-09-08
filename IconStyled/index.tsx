import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material";

export const IconStyled = styled(FontAwesomeIcon)<FontAwesomeIconProps>(
  ({ theme }) => ({
    "--fa-primary-color": theme.palette.primary.main,
  })
);
