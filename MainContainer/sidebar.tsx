import {
  Divider,
  Drawer,
  DrawerProps,
  IconButton,
  styled,
  Toolbar,
} from "@mui/material";
import { useMC } from "./ctx";
import { useCore } from "../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MCSidebar = styled(({ className }: { className?: string }) => {
  const { sidebar, open, handleOpen, disableSidebarPadding } = useMC();
  const { isMobile } = useCore();

  const getVariant = (): Exclude<DrawerProps["variant"], undefined> => {
    if (disableSidebarPadding) {
      return "temporary";
    } else {
      return isMobile ? "temporary" : "permanent";
    }
  };

  return sidebar ? (
    <Drawer
      variant={getVariant()}
      open={open.sidebar}
      onClose={handleOpen("sidebar", false)}
      PaperProps={{ className }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={handleOpen("sidebar", false)}>
          <FontAwesomeIcon icon={["fad", "bars"]} />
        </IconButton>
      </Toolbar>
      <Divider />
      {sidebar}
      <Toolbar />
    </Drawer>
  ) : null;
})(({ theme }) => ({
  width: theme.sidebarWidth,
  zIndex: theme.zIndex.appBar - 1,
}));
