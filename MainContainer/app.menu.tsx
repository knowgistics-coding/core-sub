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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useCore } from "../context";
import { AppIcon } from "./app.icon";

const MenuContainer = styled(Box)(({ theme }) => ({
  width: theme.sidebarWidth * 1.25,
  maxWidth: "75vw",
  padding: theme.spacing(3, 2),
  ...theme.typography.caption,
  // textTransform: 'uppercase',
  boxSizing: "border-box",
}));

const Divider = styled(Box)({ borderBottom: `solid 1px ${grey[300]}` });

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
  "--fa-secondary-opacity": 0.25,
  marginBottom: 4,
}));

export const MCAppMenu = (props: BoxProps) => {
  const { appMenu } = useCore();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const handleOpen = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  return appMenu?.length ? (
    <Box {...props}>
      <IconButton color="primary" onClick={handleOpen}>
        <AppIcon open={Boolean(anchorEl)} />
      </IconButton>
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
                      <FAStyled icon={icon || ["fad", "question"]} />
                      {label}
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
                        <FAStyled icon={icon || ["fad", "question"]} />
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
