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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCore } from "../context";
import { PanelMove } from "./panels/move";
import { PanelSpacing } from "./panels/spacing";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import update from "react-addons-update";

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
  border: `solid 1px ${theme.palette.text.secondary}`,
  borderRadius: `4px 4px 0 0`,
  marginBottom: -1,
}));

const DragIcon = SortableHandle<IconButtonProps>((props: IconButtonProps) => (
  <IconButton {...props}>
    <FontAwesomeIcon icon={["far", "grip-lines"]} size="xs" />
  </IconButton>
));

const ListItemButtonPre = ({
  label,
  icon,
  listItemTextProps,
  ...props
}: Omit<ListItemButtonProps, "children"> & {
  label: string;
  icon?: IconProp;
  listItemTextProps?: ListItemTextProps;
}) => {
  const { t } = useCore();
  return (
    <ListItemButton {...props}>
      {icon && (
        <ListItemIcon>
          <FontAwesomeIcon icon={icon} />
        </ListItemIcon>
      )}
      <ListItemText primary={t(label)} {...listItemTextProps} />
    </ListItemButton>
  );
};

interface PEPanelProps {
  contentKey: string;
  content: PageContentTypes;
  index: number;
  children?: React.ReactNode;
  noContainer?: boolean;
  actions?: React.ReactNode;
  startActions?: React.ReactNode;
  endActions?: React.ReactNode;
  maxWidth?: Breakpoint;
}
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
    setData,
    maxWidth,
  } = usePE();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<string>("");

  const handleOpen = (key: string) => () => {
    setOpen(key);
    setAnchorEl(null);
  };
  const handleClose = () => setOpen("");
  const handleChangeSpacing = (top: number, bottom: number) => {
    setData((d) =>
      update(d, { contents: { [index]: { $merge: { mt: top, mb: bottom } } } })
    );
    setOpen("");
  };
  const handleChangeChecked = (_event: any, checked: boolean) => {
    if (checked) {
      setState((s) => ({ ...s, selected: selected.concat(contentKey) }));
    } else {
      setState((s) => ({
        ...s,
        selected: selected.filter((key) => key !== contentKey),
      }));
    }
  };

  return (
    <Box
      pt={typeof content?.mt === "number" ? content.mt : 0}
      pb={typeof content?.mb === "number" ? content.mb : 0}
    >
      <Wrapper noContainer={noContainer} maxWidth={props?.maxWidth || maxWidth}>
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
              <FontAwesomeIcon size="xs" icon={["far", "ellipsis-v"]} />
            </IconButton>
          </Action>
        )}
        <Box py={1}>
        {children}
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
          <PanelMove index={index} onClose={() => setAnchorEl(null)} />
          <ListItemButtonPre
            label="Spacing"
            icon={["far", "arrows-v"]}
            onClick={handleOpen("spacing")}
          />
          <ListItemButton
            onClick={() => setState((s) => ({ ...s, remove: index }))}
          >
            <ListItemIcon>
              <Typography color="error">
                <FontAwesomeIcon icon={["far", "trash"]} />
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
