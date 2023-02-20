import { Box, styled, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useCore } from "../context";

//ANCHOR - Root
const Root = styled(Box)(({ theme }) => ({
  position: "relative",
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  "&:after": {
    content: "''",
    display: "block",
    paddingTop: "100%",
  },
}));

//ANCHOR - Inner
const Inner = styled(Box)(({ theme }) => ({
  ...theme.mixins.absoluteFluid,
  display: "flex",
  flexDirection: "column",
}));

//ANCHOR - TextZone
const TextZone = styled(Box)({
  flexGrow: 1,
  marginBlock: 8,
  marginInline: 16,
});

//SECTION - SlideShowEditCard
//ANCHOR - [type] SlideShowEditCardProps
export type SlideShowEditCardProps = {
  index: number;
  length: number;
  title?: ReactNode;
};

export const SlideShowEditCard = (props: SlideShowEditCardProps) => {
  const { t } = useCore();

  return (
    <Root>
      <Inner>
        <TextZone>
          <Typography variant="caption" color="textSecondary">
            [{props.index + 1}/{props.length}]
          </Typography>
          <Typography variant="h6">{props.title ?? t("No Title")}</Typography>
        </TextZone>
      </Inner>
    </Root>
  );
};
//!SECTION
