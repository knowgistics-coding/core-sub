import { ReactNode } from "react";
import {
  Box,
  Grid,
  GridProps,
  styled,
  Typography,
  TypographyProps,
} from "@mui/material";
import { StockDisplay, StockDisplayProps } from "../StockDisplay";

const CardContent = styled("div")(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
}));
const CardBody = styled("div")({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  overflow: "hidden",
});
const CardAction = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 2),
  paddingTop: 0,
  display: "flex",
  justifyContent: "flex-end",
  '& [class*="MuiButton"]:not(:last-child)': {
    marginRight: theme.spacing(1),
  },
}));
export const CardMore = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(0.5),
  right: theme.spacing(0.5),
  zIndex: 1,
  color: "white",
}));

export interface CardItemProps {
  gridProps?: GridProps;
  cover?: StockDisplayProps;
  primary?: ReactNode;
  secondary?: ReactNode;
  tertiary?: ReactNode;
  primaryTypographyProps?: TypographyProps;
  secondaryTypographyProps?: TypographyProps;
  tertiaryTypographyProps?: TypographyProps;
  actions?: ReactNode;
  more?: ReactNode;
}
export const CardItem = styled(
  ({
    gridProps,
    cover,
    primary,
    secondary,
    tertiary,
    primaryTypographyProps,
    secondaryTypographyProps,
    tertiaryTypographyProps,
    actions,
    more,
    ...props
  }: CardItemProps) => (
    <Grid item xl={2} lg={3} md={4} sm={6} xs={12} {...gridProps}>
      <div {...props}>
        <CardContent>
          <CardBody>
            {cover && <StockDisplay {...cover} ratio={1 / 2} />}
            <Box p={2}>
              {primary && (
                <Box mb={0.5}>
                  <Typography variant="h6" {...primaryTypographyProps}>
                    {primary}
                  </Typography>
                </Box>
              )}
              {secondary && (
                <Box mb={0.5}>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    noWrap
                    {...secondaryTypographyProps}
                  >
                    {secondary}
                  </Typography>
                </Box>
              )}
              {tertiary && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  noWrap
                  {...tertiaryTypographyProps}
                >
                  {tertiary}
                </Typography>
              )}
            </Box>
          </CardBody>
          {actions && <CardAction>{actions}</CardAction>}
        </CardContent>
        {more && <CardMore>{more}</CardMore>}
      </div>
    </Grid>
  )
)(({ theme }) => ({
  position: "relative",
  border: `solid 1px ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  transition: "transform 0.25s",
  overflow: "hidden",
  "&:before": {
    content: "''",
    display: "block",
    paddingTop: "calc(100%)",
  },
  "&:hover": {
    transform: "translateY(-8px)",
  },
}));
