import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { PickIcon } from "../PickIcon";

const FolderRoot = styled(Box)(({ theme }) => ({
  "--bg": theme.palette.grey[700],
  "--bg-hover": theme.palette.grey[800],
  "--color": "#FFF",
  border: `solid 1px var(--bg)`,
}));
const FolderContainer = styled(List)(() => ({
  borderTop: `solid 1px var(--bg)`,
}));

export const ListItemChildPost = styled(ListItemButton)(({ theme }) => ({
  boxSizing: "border-box",
  "& .MuiListItemIcon-root": {
    color: "inherit",
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
  },
}));

export interface FolderProps {
  label: string;
  length?: number;
  children?: ReactNode;
}
export const Folder = ({ label, length, children }: FolderProps) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleToggle = () => setOpen((o) => !o);

  return (
    <FolderRoot>
      <ListItemButton
        dense
        sx={{
          backgroundColor: "var(--bg)",
          color: "white",
          "&:hover": { backgroundColor: "var(--bg-hover)" },
          "& .MuiListItemIcon-root": { color: "inherit" },
        }}
        onClick={handleToggle}
      >
        <ListItemIcon>
          <PickIcon
            icon={"caret-down"}
            rotation={open ? 180 : undefined}
            style={{ transition: `all 0.25s` }}
          />
        </ListItemIcon>
        <ListItemText primary={`${label} (${length || 0})`} />
      </ListItemButton>
      <Collapse in={open}>
        <FolderContainer>{children}</FolderContainer>
      </Collapse>
    </FolderRoot>
  );
};
