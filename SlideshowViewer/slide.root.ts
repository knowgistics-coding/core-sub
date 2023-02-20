import { Box, styled } from "@mui/material";

export const SlideRoot = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100%",
  "&>.swiper": {
    height: "100%",
  }
});
