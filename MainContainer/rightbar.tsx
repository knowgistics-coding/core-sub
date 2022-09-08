import {
  Divider,
  Drawer,
  DrawerProps,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useMC } from "./ctx";
import { useCore } from "../context";

export const MCRightbar = () => {
  const { rightbar, open, handleOpen, disableSidebarPadding, restrict } =
    useMC();
  const { isMobile } = useCore();
  const isTablet = useMediaQuery("@media (min-width:1180px)");

  const getVariant = (): NonNullable<DrawerProps["variant"]> => {
    if (disableSidebarPadding) {
      return "temporary";
    } else {
      return isMobile ? "temporary" : "permanent";
    }
  };

  return rightbar && !Boolean(restrict) && isTablet ? (
    <Drawer
      variant={getVariant()}
      open={open.sidebar}
      onClose={handleOpen("sidebar", false)}
      sx={(theme) => ({
        "& .MuiPaper-root": {
          width: theme.sidebarWidth,
          zIndex: theme.zIndex.appBar - 1,
          backgroundColor: "background.paper",
        },
      })}
      anchor="right"
    >
      <Toolbar />
      <Divider />
      {rightbar}
      <Toolbar />
    </Drawer>
  ) : null;
};
