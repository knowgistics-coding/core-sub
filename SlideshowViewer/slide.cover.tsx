import { Box, Stack, styled, Typography, TypographyProps } from "@mui/material";
import { useCore } from "../context";
import { DateCtl } from "../Controller";
import { Counter } from "../Counter";
import { CoverUser } from "../CoverUser";
import { PickIcon } from "../PickIcon";
import { StockDisplayProps, StockDisplay } from "../StockDisplay";
import { SlideBox } from "./slide.box";

export const TextContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  padding: theme.spacing(0, 3),
  color: "white",
  ...theme.mixins.flexMiddle,
  "& .cover-content": {
    textAlign: "center",
    padding: theme.spacing(3),
    maxWidth: theme.breakpoints.values.sm,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .cover-icon": {
      margin: theme.spacing(0, 0, 3),
    },
  },
}));

const VerticalLine = styled("span")(({ theme }) => ({
  padding: theme.spacing(0, 0.5),
  "&:before": {
    content: '"|"',
    display: "inline-block",
  },
}));

export type SlideCoverProps = {
  image?: StockDisplayProps | null;
  primary?: string;
  secondary?: string;
  primaryProps?: Omit<TypographyProps, "children">;
  secondaryProps?: Omit<TypographyProps, "children">;
  date?: number;
  slideId?: string;
  user?: string;
};

export const SlideCover = (props: SlideCoverProps) => {
  const { t } = useCore();

  return (
    <SlideBox sx={{ "& .StockDisplay-root": { filter: "brightness(60%)" } }}>
      {props.image && (
        <StockDisplay
          {...props.image}
          size="large"
          rootProps={{ sx: { width: "100%", height: "100%" } }}
        />
      )}
      {(!!props.primary || !!props.secondary) && (
        <TextContainer>
          <Box className="cover-content">
            <Typography className="cover-icon">
              <PickIcon icon="images" style={{ marginRight: "0.5rem" }} />
              {t("SLIDESHOW")}
            </Typography>
            {props.primary && (
              <Typography variant="h1">{props.primary}</Typography>
            )}
            {props.secondary && (
              <Typography variant="body2">{props.secondary}</Typography>
            )}
            {props.date && (
              <Typography variant="body2" component="div">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <PickIcon
                    icon={"calendar"}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {DateCtl.toCoverDate(props.date)}
                  <VerticalLine />
                  <PickIcon icon={"clock"} style={{ marginRight: "0.5rem" }} />
                  {DateCtl.toCoverTime(props.date)}
                  <VerticalLine />
                  <PickIcon icon={"eye"} style={{ marginRight: "0.5rem" }} />
                  <Counter id={props.slideId} />
                </Stack>
              </Typography>
            )}
          </Box>
          {props.user && <CoverUser value={props.user} />}
        </TextContainer>
      )}
    </SlideBox>
  );
};
