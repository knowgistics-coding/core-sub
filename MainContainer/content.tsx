import { Box, styled, Theme, useMediaQuery } from "@mui/material";
import { useMC } from "./ctx";
import { useCore } from "../context";

const LeftPad = styled(({ open, ...props }: { open?: boolean }) => (
  <div {...props} />
))(({ theme, open }: { open?: boolean; theme: Theme }) => ({
  paddingLeft: open ? theme.sidebarWidth : 0,
  transition: "padding-left 0.25s",
}));

interface MCContentProps {
  children: React.ReactNode;
}
export const MCContent = ({ children }: MCContentProps) => {
  const { dense, sidebar, rightbar, disableSidebarPadding, restrict } = useMC();
  const { isMobile } = useCore();
  const isTablet = useMediaQuery("@media (min-width:1180px)");

  const getLeftSidebarOpen = (): boolean => {
    if (disableSidebarPadding) {
      return false;
    } else {
      return Boolean(sidebar && !isMobile && !Boolean(restrict));
    }
  };
  const getLeftRightbarOpen = (): boolean => {
    if (disableSidebarPadding) {
      return false;
    } else {
      return Boolean(rightbar && !isMobile && !Boolean(restrict));
    }
  };

  return (
    <Box display={"flex"}>
      <LeftPad open={getLeftSidebarOpen()} />
      <Box flex={1} pt={dense ? 0 : 6} pb={dense ? 0 : 6}>
        {children}
      </Box>
      {isTablet && <LeftPad open={getLeftRightbarOpen()} />}
    </Box>
  );
};
