import { Box, styled, Typography } from "@mui/material";
import { ReactNode } from "react";
import { StockDisplayProps, StockDisplay } from "../StockDisplay";
import { SlideBox } from "./slide.box";

const TextContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  width: theme.sidebarWidth,
  padding: theme.spacing(1, 1.5),
}));

export const SlideItem = (props: {
  image?: StockDisplayProps | null;
  title?: string;
  secondary?: ReactNode;
  counter: string;
}) => {
  return (
    <SlideBox>
      {props.image && (
        <StockDisplay
          {...props.image}
          rootProps={{ sx: { flex: 1, height: "100%" } }}
        />
      )}
      <TextContainer>
        <Typography variant="caption" component="div" sx={{ mb: 1 }}>
          [{props.counter}]
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {props.secondary}
        </Typography>
      </TextContainer>
    </SlideBox>
  );
};
