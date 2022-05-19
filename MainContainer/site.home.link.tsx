import { Box, BoxProps, Stack, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Root = styled(Box)({ cursor: "pointer" });

export type SiteHomeLinkProps = Omit<BoxProps, "onClick">;

export const SiteHomeLink = ({ children, ...props }: SiteHomeLinkProps) => {
  const nav = useNavigate();

  return (
    <Root {...props} onClick={() => nav("/")}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {children}
      </Stack>
    </Root>
  );
};
