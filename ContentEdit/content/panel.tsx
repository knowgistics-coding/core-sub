import React, { MouseEvent, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  ContainerProps,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  styled,
} from "@mui/material";
import { Container } from "../../Container";
import { grey, orange } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import { useCE } from "../ctx";
import update from "react-addons-update";
import { DialogChangeSpacing } from "./panel.control.spacing";

const Handle = SortableHandle(
  React.forwardRef((props, _ref) => (
    <Button {...props}>
      <FontAwesomeIcon icon={["fad", "bars"]} />
    </Button>
  ))
);

const Root = styled(Box)(({ selected }: { selected?: boolean }) => ({
  position: "relative",
  backgroundColor: selected ? grey[50] : "white",
  transition: "background-color 0.25s",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: grey[100],
  },
}));
const ControlContainer = styled("div")({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
});
const PaddingHover = styled(Box)({
  backgroundColor: "none",
  transition: "all 0.5s",
  "&:hover": {
    backgroundColor: orange[50],
  },
});

interface CEPanelProps {
  contentKey: string;
  children: React.ReactNode;
  maxWidth?: ContainerProps["maxWidth"];
  rootProps?: BoxProps;
}
export const CEPanel = SortableElement<CEPanelProps>(
  ({ children, maxWidth, rootProps, contentKey }: CEPanelProps) => {
    const { getContentIndex, data, setData } = useCE();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});
    const index = getContentIndex(contentKey);

    const getSpacing = (
      key: "top" | "bottom",
      defaultValue: number = 0
    ): number => {
      const value = data.contents?.[index]?.[key] as number;
      return value || defaultValue;
    };

    const handleOpenMenu = ({ currentTarget }: MouseEvent<HTMLButtonElement>) =>
      setAnchorEl(currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);
    const handleRemove = () => {
      setAnchorEl(null);
      setData((d) => update(d, { contents: { $splice: [[index, 1]] } }));
    };

    const handleOpenDialog = (key: string, value: boolean) => () => {
      setAnchorEl(null);
      setOpen((o) => ({ ...o, [key]: value }));
    };

    const handleChangeSpacing = (top: number, bottom: number) => {
      if (index > -1) {
        setData((d) =>
          update(d, { contents: { [index]: { $merge: { top, bottom } } } })
        );
      }
    };

    const handleMoveUp = () => {
      const [newContent, OldContent] = [
        data?.contents?.[index],
        data?.contents?.[index - 1],
      ];
      if (newContent && OldContent) {
        setData((d) =>
          update(d, {
            contents: {
              [index]: { $set: OldContent },
              [index - 1]: { $set: newContent },
            },
          })
        );
        setAnchorEl(null);
      }
    };
    const handleMoveDown = () => {
      const [newContent, OldContent] = [
        data?.contents?.[index],
        data?.contents?.[index + 1],
      ];
      if (newContent && OldContent) {
        setData((d) =>
          update(d, {
            contents: {
              [index]: { $set: OldContent },
              [index + 1]: { $set: newContent },
            },
          })
        );
        setAnchorEl(null);
      }
    };

    return (
      <Root {...rootProps}>
        <PaddingHover pt={getSpacing("top")} />
        <ControlContainer>
          <ButtonGroup variant="outlined" size="small">
            <Handle />
            <Button onClick={handleOpenMenu}>
              <FontAwesomeIcon icon={["fad", "ellipsis-v"]} />
            </Button>
          </ButtonGroup>
        </ControlContainer>
        <Container maxWidth={maxWidth}>
          <Box style={{ position: "relative" }}>{children}</Box>
        </Container>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <List dense>
            {index !== 0 && (
              <ListItemButton onClick={handleMoveUp}>
                <ListItemText primary="Move Up" />
              </ListItemButton>
            )}
            {(data?.contents?.length || 0) - 1 !== index && (
              <ListItemButton onClick={handleMoveDown}>
                <ListItemText primary="Move Down" />
              </ListItemButton>
            )}
            <ListItemButton onClick={handleOpenDialog("spacing", true)}>
              <ListItemText primary="Spacing" />
            </ListItemButton>
            <ListItemButton onClick={handleRemove}>
              <ListItemText
                primary="Remove"
                primaryTypographyProps={{ color: "error" }}
              />
            </ListItemButton>
          </List>
        </Menu>
        <DialogChangeSpacing
          top={getSpacing("top")}
          bottom={getSpacing("bottom", 3)}
          open={Boolean(open.spacing)}
          onClose={handleOpenDialog("spacing", false)}
          onConfirm={handleChangeSpacing}
        />
        <PaddingHover pb={getSpacing("bottom", 3)} />
      </Root>
    );
  }
);
