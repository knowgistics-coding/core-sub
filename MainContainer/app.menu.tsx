import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  Box,
  BoxProps,
  Grid,
  IconButton,
  Menu,
  styled,
  Theme,
  Typography,
} from "@mui/material";
import { MouseEvent, SVGProps, useState } from "react";
import { Link } from "react-router-dom";
import { useCore } from "../context";
import { ReactComponent as Icon } from "./logo.svg";
import clsx from "clsx";
import Icons from "./icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { LocaleKey } from "../Translate/en_th";

const MenuContainer = styled(Box)(({ theme }) => ({
  width: theme.sidebarWidth * 1.25,
  maxWidth: "75vw",
  padding: theme.spacing(3, 2),
  ...theme.typography.caption,
  boxSizing: "border-box",
}));

const MenuIcon = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme }) => ({
  "--cl-base": theme.palette.divider, //#E0E0E0
  "--cl-blue": theme.palette.info.main,
  color: theme.palette.info.main,
  "&>svg": {
    width: 30,
    height: 30,
    "& .cl-change": {
      transition: "fill 1s",
    },
    "& .cl2": { fill: "var(--cl-base)" },
    "& .cl8": { fill: "var(--cl-blue)" },
    "&.icon-open": {
      "& .cl2": { fill: "var(--cl-blue)" },
      "& .cl8": { fill: "var(--cl-base)" },
    },
  },
}));

const Divider = styled(Box)(({ theme }) => ({
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));

const getTheme = (theme: Theme): any => ({
  color: "inherit",
  textDecoration: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  translate: "all 0.25s",
  backgroundColor: "rgba(0,0,0,0)",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0, 0),
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.125)",
  },
});

const ALink = styled("a")(({ theme }) => getTheme(theme));
const ASpan = styled("span")(({ theme }) => getTheme(theme));

const FAStyled = styled((props: FontAwesomeIconProps) => (
  <FontAwesomeIcon size="4x" {...props} />
))(({ theme }) => ({
  "--fa-primary-color": theme.palette.primary.main,
  "--fa-secondary-color": theme.palette.text.primary,
  "--fa-secondary-opacity": 0.25,
  marginBottom: 4,
}));

type MekIconProps = SVGProps<any> & {
  icon?: IconProp;
};
const MekIcon = styled(({ icon, ...props }: MekIconProps) => {
  const key = Array.isArray(icon) ? icon[1] : null;
  if (key && Icons?.[key]) {
    const Comp = Icons[key];
    return <Comp {...props} />;
  } else if(icon) {
    return <FAStyled icon={icon} />;
  } else {
    return <FAStyled icon={["far", "question"]} />;
  }
})({
  height: 48,
  marginBottom: 4,
});

export const MCAppMenu = (props: BoxProps) => {
  const { appMenu, t } = useCore();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpen = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return appMenu?.length ? (
    <Box {...props}>
      <MenuIcon open={Boolean(anchorEl)} onClick={handleOpen}>
        <Icon
          className={clsx("menu-icon", {
            "icon-open": Boolean(anchorEl),
          })}
        />
      </MenuIcon>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuContainer>
          <Grid container spacing={1}>
            {appMenu?.map((item, index) => {
              const { type, icon, label, href, to } = item;
              if (type === "a" && href && label && icon) {
                return (
                  <Grid item xs={4} key={index}>
                    <ALink href={href}>
                      <MekIcon icon={icon} />
                      {/* <FAStyled icon={icon || ["far", "question"]} /> */}
                      <Typography variant="body2">{t(String(label) as LocaleKey)}</Typography>
                    </ALink>
                  </Grid>
                );
              } else if (type === "Link" && icon && label && to) {
                return (
                  <Grid item xs={4} key={index}>
                    <Link
                      to={to}
                      style={{ color: "inherit", textDecoration: "none" }}
                      onClick={handleClose}
                    >
                      <ASpan>
                        <FAStyled icon={icon || ["far", "question"]} />
                        {label}
                      </ASpan>
                    </Link>
                  </Grid>
                );
              } else if (type === "divider") {
                return (
                  <Grid item xs={12} key={index}>
                    <Divider my={1} />
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </MenuContainer>
      </Menu>
    </Box>
  ) : null;
};
