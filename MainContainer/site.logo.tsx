import { Box, BoxProps, styled } from "@mui/material";
import * as React from "react";
import { CoreContextTypes } from "../context";

const Root = styled(Box)<BoxProps & { ratio: number }>(({ ratio }) => ({
  height: 48,
  width: 48 * ratio,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));

export const SiteLogo = ({
  logo,
  ...props
}: Omit<BoxProps, "children"> & Pick<CoreContextTypes, "logo">) => {
  const [ratio, setRatio] = React.useState<number>(1);

  React.useEffect(() => {
    if (logo) {
      const image = new Image();
      image.onload = () => {
        const { width, height } = image;
        setRatio(width / height);
      };
      image.src = logo;
    }
  }, [logo]);

  return logo ? (
    <Root ratio={ratio} {...props}>
      <img src={logo} alt="site logo" />
    </Root>
  ) : null;
};
