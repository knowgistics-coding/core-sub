import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const KuiLink = styled(Link)(({theme}) => ({
  color: theme.palette.info.main
}))