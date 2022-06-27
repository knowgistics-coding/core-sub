import { AppBar, Box, Stack, styled, Toolbar, Typography } from "@mui/material";
import { useMC } from "./ctx";
import { useCore } from "../context";
import { MCIconProfile } from "./icon.profile";
import { MCAppMenu } from "./app.menu";
import { SidebarToggleButton } from "./sidebar.toggle.button";
import { SiteLogo } from "./site.logo";
import { SiteHomeLink } from "./site.home.link";
import { deepmerge } from "@mui/utils";

const AppBarStyled = styled(AppBar)(({ theme }) =>
  deepmerge(
    {
      backgroundColor: theme.palette.background.paper,
      borderBottom: 'solid 1px',
      borderColor: theme.palette.divider,
    },
    theme.palette.appbar
  )
);

export const MCAppbar = () => {
  const {
    sidebar,
    handleOpen,
    startActions: sa,
    endActions: ea,
    disableSidebarPadding,
  } = useMC();
  const { sitename, logo, isMobile, startActions, endActions } = useCore();

  return (
    <AppBarStyled elevation={0}>
      <Toolbar>
        <Stack direction="row" alignItems="center" spacing={1} flex={1}>
          {(Boolean(disableSidebarPadding && sidebar) ||
            Boolean(sidebar && isMobile)) && (
            <SidebarToggleButton onClick={handleOpen("sidebar", true)} />
          )}
          {Boolean(sitename || logo) && (
            <SiteHomeLink>
              <SiteLogo logo={logo} />
              {sitename && !isMobile && (
                <Typography className="site-name" variant="h6">
                  {sitename}
                </Typography>
              )}
            </SiteHomeLink>
          )}
          {startActions}
          {sa}
          <Box flex={1} />
          {ea}
          {endActions}
          <MCAppMenu />
          <MCIconProfile />
        </Stack>
      </Toolbar>
    </AppBarStyled>
  );
};
