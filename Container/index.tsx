import { Container as OContainer, ContainerProps, styled } from "@mui/material";

const Root = styled("div")(({ theme }) => ({ padding: theme.spacing(0, 3) }));

export type { ContainerProps };

export const Container = styled((props: ContainerProps) => (
  <Root>
    <OContainer {...props} />
  </Root>
))({ padding: "0 !important" });
