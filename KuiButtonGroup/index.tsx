import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  alpha,
  Button,
  ButtonProps,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  Stack,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TFunction, useCore } from "../context";
import { KuiButtonProps } from "../KuiButton";

export type ButtonPalette =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "error"
  | "neutral";

const ButtonStyled = styled(Button)({});
ButtonStyled.defaultProps = {
  variant: "outlined",
  color: "neutral",
};

const ListItemButtonStyled = styled(ListItemButton)<
  Omit<ListItemButtonProps, "color"> & {
    color?: ButtonPalette;
  }
>(({ theme, color }) => ({
  color: theme.palette[color || "neutral"]?.main,
  "&:hover": {
    backgroundColor: alpha(theme.palette[color || "neutral"]?.main, 0.1),
  },
  "& .MuiListItemIcon-root": {
    color: "inherit",
  },
}));

export type KuiButtonItemProps = {
  tx?: KuiButtonProps["tx"];
  onClick?: () => void;
  color?: ButtonPalette;
} & Omit<ButtonProps, "onClick" | "color">;

const lists = (
  t: TFunction
): Record<
  KuiButtonProps["tx"],
  Omit<ButtonProps, "color"> & { color?: ButtonPalette }
> => ({
  add: {
    variant: "outlined",
    children: t("Create"),
    startIcon: <FontAwesomeIcon icon={["far", "plus"]} />,
    color: "info",
  },
  bin: {
    children: t("Remove"),
    startIcon: <FontAwesomeIcon icon={["far", "trash"]} />,
    color: "error",
  },
  browse: {
    children: t("Browse"),
    startIcon: <FontAwesomeIcon icon={["far", "folder-open"]} />,
  },
  cancel: {
    children: t("Cancel"),
    startIcon: <FontAwesomeIcon icon={["far", "ban"]} />,
  },
  confirm: {
    children: t("Confirm"),
    startIcon: <FontAwesomeIcon icon={["far", "check"]} />,
    color: "info",
  },
  clear: {
    children: t("Clear"),
    startIcon: <FontAwesomeIcon icon={["far", "redo"]} />,
  },
  close: {
    children: t("Close"),
    startIcon: <FontAwesomeIcon icon={["far", "xmark"]} />,
  },
  download: {
    children: t("Download"),
    startIcon: <FontAwesomeIcon icon={["far", "download"]} />,
  },
  import: {
    children: t("Import"),
    startIcon: <FontAwesomeIcon icon={["far", "download"]} />,
  },
  remove: {
    children: t("Remove"),
    startIcon: <FontAwesomeIcon icon={["far", "trash"]} />,
    color: "error",
  },
  save: {
    children: t("Save"),
    startIcon: <FontAwesomeIcon icon={["far", "save"]} />,
  },
  setting: {
    children: t("Setting"),
    startIcon: <FontAwesomeIcon icon={["far", "cog"]} />,
  },
  signout: {
    children: t("Sign Out"),
    startIcon: <FontAwesomeIcon icon={["far", "sign-out"]} />,
    color: "error",
  },
  upload: {
    children: t("Upload"),
    startIcon: <FontAwesomeIcon icon={["far", "upload"]} />,
  },
});

export type KuiButtonGroupProps = {
  list: (KuiButtonItemProps | null)[];
};
export const KuiButtonGroup = (props: KuiButtonGroupProps) => {
  const { t, isMobile } = useCore();
  const [anchor, setAnchor] = useState<Element | null>(null);

  const handleClose = () => setAnchor(null);

  useEffect(() => {
    if (!isMobile) {
      setAnchor(null);
    }
  }, [isMobile]);

  return isMobile ? (
    <>
      <ButtonStyled
        endIcon={<FontAwesomeIcon icon={["far", "chevron-down"]} />}
        onClick={({ currentTarget }) => setAnchor(currentTarget)}
      >
        {t("Menu")}
      </ButtonStyled>
      <Menu
        open={Boolean(anchor)}
        anchorEl={anchor}
        MenuListProps={{ dense: true }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        {props.list
          .filter((list): list is KuiButtonItemProps => !!list)
          .map(({ tx, ...item }, index) => {
            return tx ? (
              <ListItemButtonStyled
                key={index}
                color={item.color || lists(t)[tx].color}
                onClick={item.onClick}
              >
                <ListItemIcon>
                  {item.startIcon ||
                    item.endIcon ||
                    lists(t)[tx].startIcon ||
                    lists(t)[tx].endIcon}
                </ListItemIcon>
                <ListItemText
                  primary={item.children || lists(t)[tx].children}
                />
              </ListItemButtonStyled>
            ) : (
              <ListItemButtonStyled
                key={index}
                color={item.color}
                onClick={item.onClick}
              >
                {(item.startIcon || item.endIcon) && (
                  <ListItemIcon>{item.startIcon || item.endIcon}</ListItemIcon>
                )}
                <ListItemText primary={item.children} />
              </ListItemButtonStyled>
            );
          })}
      </Menu>
    </>
  ) : (
    <Stack direction="row" spacing={1}>
      {props.list
        .filter((list): list is KuiButtonItemProps => !!list)
        .map(({ tx, ...item }, index) => {
          return tx ? (
            <ButtonStyled {...lists(t)[tx]} {...item} key={index} />
          ) : (
            <ButtonStyled {...item} key={index} />
          );
        })}
    </Stack>
  );
};
