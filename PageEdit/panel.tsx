import React, { Fragment, useState } from "react";
import { Container } from "../Container";
import { PageContentTypes, usePE } from "./context";
import {
  Box,
  Breakpoint,
  Checkbox,
  IconButton,
  IconButtonProps,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  Menu,
  styled,
  Typography,
} from "@mui/material";
import { SortableHandle } from "react-sortable-hoc";
import { useCore } from "../context";
import { PanelMove } from "./panels/move";
import { PanelSpacing } from "./panels/spacing";
import { usePopup } from "../Popup";
import { LocaleKey } from "../Translate/en_th";
import { PickIcon, PickIconName } from "../PickIcon";

const Wrapper = ({
  children,
  noContainer,
  maxWidth,
}: {
  children: React.ReactNode;
  noContainer?: boolean;
  maxWidth?: false | Breakpoint;
}) =>
  noContainer ? (
    <Fragment>{children}</Fragment>
  ) : (
    <Container maxWidth={maxWidth || "post"}>{children}</Container>
  );

const Action = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  marginBottom: -1,
}));

const DragIcon = SortableHandle<IconButtonProps>((props: IconButtonProps) => (
  <IconButton {...props}>
    <PickIcon icon={"grip-dots-vertical"} size="xs" />
  </IconButton>
));

const ListItemButtonPre = ({
  label,
  icon,
  listItemTextProps,
  ...props
}: Omit<ListItemButtonProps, "children"> & {
  label: LocaleKey;
  icon?: PickIconName;
  listItemTextProps?: ListItemTextProps;
}) => {
  const { t } = useCore();
  return (
    <ListItemButton {...props}>
      {icon && (
        <ListItemIcon>
          <PickIcon icon={icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={t(label)} {...listItemTextProps} />
    </ListItemButton>
  );
};

export type PEPanelProps = {
  contentKey: string;
  content: PageContentTypes;
  index: number;
  children?: React.ReactNode;
  noContainer?: boolean;
  actions?: React.ReactNode;
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
  maxWidth?: Breakpoint;
};
export const PEPanel = ({
  contentKey,
  content,
  children,
  index,
  noContainer,
  actions,
  startActions,
  endActions,
  ...props
}: PEPanelProps) => {
  const { t } = useCore();
  const {
    state: { hideToolbar, selected },
    setState,
    data,
    setData,
    maxWidth,
  } = usePE();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<string>("");
  const { Popup } = usePopup();

  const handleOpen = (key: string) => () => {
    setOpen(key);
    setAnchorEl(null);
  };
  const handleClose = () => setOpen("");
  const handleChangeSpacing = (top: number, bottom: number) => {
    setData(data.contentSpaceSizing(contentKey, top, bottom));
    setOpen("");
  };
  const handleChangeChecked = (event: any, checked: boolean) => {
    const isShift = Boolean(event?.nativeEvent?.shiftKey);
    if (checked) {
      if (isShift) {
        setState((s) => {
          let selected = [...s.selected];
          const firstIndex =
            data.contents?.findIndex(
              (content) => content.key === selected[selected.length - 1]
            ) ?? -1;
          const lastIndex =
            data.contents?.findIndex((content) => content.key === contentKey) ??
            -1;
          if (firstIndex > -1 && lastIndex > -1) {
            selected = selected.concat(
              ...(
                data.contents
                  ?.slice(firstIndex + 1, lastIndex + 1)
                  .map((content) => content.key) ?? []
              ).filter((s, i, a) => a.indexOf(s) === i)
            );
          }
          return { ...s, selected };
        });
      } else {
        setState((s) => ({ ...s, selected: selected.concat(contentKey) }));
      }
    } else {
      setState((s) => ({
        ...s,
        selected: selected.filter((key) => key !== contentKey),
      }));
    }
  };
  const handleRemove = () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Item") }),
      icon: "trash",
      onConfirm: () => setData(data.contentRemoved(contentKey)),
    });
  };

  return (
    <Box pt={content?.mt ?? 0} pb={content?.mb ?? 2}>
      <Wrapper noContainer={noContainer} maxWidth={props?.maxWidth || maxWidth}>
        <Box
          sx={{
            borderStyle: "solid",
            borderWidth: hideToolbar ? 0 : 1,
            borderColor: "divider",
          }}
        >
          {hideToolbar === false && (
            <Action
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems="center"
            >
              <DragIcon />
              <Checkbox
                edge="start"
                checked={selected.includes(contentKey)}
                onChange={handleChangeChecked}
                color="info"
              />
              {startActions}
              <Box flex={1} />
              {endActions}
              <IconButton
                onClick={({
                  currentTarget,
                }: React.MouseEvent<HTMLButtonElement>) =>
                  setAnchorEl(currentTarget)
                }
              >
                <PickIcon size="xs" icon={"ellipsis-v"} />
              </IconButton>
            </Action>
          )}
          <Box>{children}</Box>
        </Box>
      </Wrapper>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List dense>
          {actions}
          <ListItemButton
            onClick={() => {
              setAnchorEl(null);
              setState((s) => ({ ...s, insert: content.key }));
            }}
          >
            <ListItemIcon>
              <PickIcon icon={"diagram-predecessor"} />
            </ListItemIcon>
            <ListItemText primary={t("Insert Before")} />
          </ListItemButton>
          <PanelMove index={index} onClose={() => setAnchorEl(null)} />
          <ListItemButtonPre
            label="Spacing"
            icon={"arrows-v"}
            onClick={handleOpen("spacing")}
          />
          <ListItemButton
            // onClick={() => setState((s) => ({ ...s, remove: index }))}
            onClick={handleRemove}
          >
            <ListItemIcon>
              <Typography color="error">
                <PickIcon icon={"trash"} />
              </Typography>
            </ListItemIcon>
            <ListItemText
              primary={t("Remove")}
              primaryTypographyProps={{ color: "error" }}
            />
          </ListItemButton>
        </List>
      </Menu>
      <PanelSpacing
        value={
          content?.mb || content?.mt
            ? { top: content?.mt || 0, bottom: content?.mb || 0 }
            : undefined
        }
        open={open === "spacing"}
        onChange={handleChangeSpacing}
        onClose={handleClose}
      />
    </Box>
  );
};
