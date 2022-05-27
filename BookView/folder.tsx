import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  styled,
} from "@mui/material";
import { ReactNode, useState } from "react";

const FolderRoot = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
}));
const FolderContainer = styled(List)(({ theme }) => ({
  borderTop: `solid 1px ${theme.palette.grey[300]}`,
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
          backgroundColor: "grey.100",
          "&:hover": { backgroundColor: "grey.300" },
          "& .MuiListItemIcon-root": { color: "inherit" },
        }}
        onClick={handleToggle}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={["far", open ? "folder-open" : "folder"]} />
        </ListItemIcon>
        <ListItemText primary={`${label} (${length || 0})`} />
        <ListItemSecondaryAction>
          <FontAwesomeIcon
            icon={["far", "caret-down"]}
            rotation={open ? 180 : undefined}
            style={{ transition: `all 0.25s` }}
          />
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={open}>
        <FolderContainer>{children}</FolderContainer>
      </Collapse>
    </FolderRoot>
  );
};
