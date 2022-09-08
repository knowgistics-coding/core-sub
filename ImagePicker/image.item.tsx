import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { useCore } from "../context";
import { BlurhashImage } from "../StockDisplay";

const Root = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  position: "relative",
  paddingTop: "100%",
  width: "100%",
  "&:hover img": {
    objectFit: "contain",
  },
  "& .main-image": {
    ...theme.mixins.absoluteFluid,
    objectFit: "cover",
  },
  "& .protect-image": {
    ...theme.mixins.absoluteFluid,
  },
  "& .checkbox": {
    position: "absolute",
    paddingLeft: 16,
    backgroundColor: `#0008`,
    left: 0,
    bottom: 0,
  },
}));

export type ImageItemProps = {
  src: string;
  hash?: string;
};
export const ImageItem = (props: ImageItemProps) => {
  const { t } = useCore();

  return (
    <Grid item xs={6} sm={4} md={3}>
      <Root>
        <img className="main-image" src={props.src} alt="main" />
        <img
          className="protect-image"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          alt="protect"
        />
        {props.hash && <BlurhashImage hash={props.hash} />}
        <Box className="checkbox">
          <FormControlLabel
            label={<Typography variant="body2">{t("Choose")}</Typography>}
            control={<Checkbox size="small" />}
          />
        </Box>
      </Root>
    </Grid>
  );
};
