import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMC } from "./ctx";
import { CoreContextTypes, useCore } from "../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MCIconProfile } from "./icon.profile";
import { BoxProps } from "@mui/system";
import { MCAppMenu } from "./app.menu";
import { Link } from "react-router-dom";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  ...(theme.palette?.appbar || {}),
}));
const ToolbarStyled = styled(Toolbar)({
  "&>:not(:last-child)": {
    marginRight: "0.5rem",
  },
});

const SiteHomeLink = styled((props: BoxProps) => {
  return <Box component={Link} to="/" {...props} />;
})(() => ({
  height: "100%",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  "&>img": {
    maxHeight: 42,
    height: 42,
    width: "auto",
  },
  "&>.site-name": {
    whiteSpace: "nowrap",
  },
}));

const SiteLogo = ({ logo }: { logo: CoreContextTypes["logo"] }) => {
  const [style, setStyle] = useState<{ [key: string]: string | number }>({
    marginRight: 8,
  });
  useEffect(() => {
    if (logo) {
      const image = new Image();
      image.onload = () => {
        const { width, height } = image;
        if (width && height) {
          setStyle((s) => ({ ...s, width: (width / height) * 42, height: 42 }));
        } else {
          setStyle((s) => ({ ...s, width: 42, height: 42 }));
        }
      };
      image.src = logo;
    }
  }, [logo]);
  return typeof logo === "string" ? (
    <img src={logo} alt="site logo" style={style} />
  ) : (
    logo || null
  );
};

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
      <ToolbarStyled>
        {disableSidebarPadding
          ? Boolean(sidebar) && (
              <IconButton edge="start" onClick={handleOpen("sidebar", true)}>
                <FontAwesomeIcon icon={["fad", "bars"]} />
              </IconButton>
            )
          : Boolean(sidebar && isMobile) && (
              <IconButton edge="start" onClick={handleOpen("sidebar", true)}>
                <FontAwesomeIcon icon={["fad", "bars"]} />
              </IconButton>
            )}
        {sitename || logo ? (
          <SiteHomeLink>
            <SiteLogo logo={logo} />
            {sitename && !isMobile && (
              <Typography className="site-name" variant="h6">
                {sitename}
              </Typography>
            )}
          </SiteHomeLink>
        ) : null}
        {startActions}
        {sa}
        <Box flex={1} />
        {ea}
        {endActions}
        <MCAppMenu />
        <MCIconProfile />
      </ToolbarStyled>
    </AppBarStyled>
  );
};
