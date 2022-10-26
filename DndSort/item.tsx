import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { DndSortItemData } from "./container";
import { useCore } from "../context";
import { ReactNode, useState } from "react";
import { PickIcon, PickIconName } from "../PickIcon";

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  boxSizing: "border-box",
}));

const Folder = styled(Box)(({ theme }) => ({
  boxSizing: "border-box",
  border: `solid 1px ${theme.palette.grey[600]}`,
}));
const FolderListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.grey[600],
  color: "white",
  "& .MuiListItemIcon-root, .MuiIconButton-root": {
    color: "inherit",
  },
}));

export type DndSortItemProps<T extends unknown> = {
  sortKey: string;
  icon: PickIconName;
  label?: string;
  variant?: "item" | "folder";
  items?: DndSortItemData<T>[];
  noChildren?: boolean;
  onDragEnd?: (event: DragEndEvent) => void;
  actions?: ReactNode;
  subactions?: (item: DndSortItemData<T>) => ReactNode;
};

export const DndSortItem = <T extends unknown>(props: DndSortItemProps<T>) => {
  const { t } = useCore();
  const {
    attributes,
    listeners,
    isDragging,
    // isSorting,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.sortKey });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.25 : 1,
  };

  const body = (
    <>
      <ListItemIcon>
        <PickIcon icon={props.icon} />
      </ListItemIcon>
      <ListItemText primary={props.label} />
      <ListItemSecondaryAction>
        {props.actions}
        <IconButton size="small" {...listeners}>
          <PickIcon icon={"grip-dots-vertical"} />
        </IconButton>
      </ListItemSecondaryAction>
    </>
  );

  return props.variant === "folder" ? (
    <Folder ref={setNodeRef} style={style} {...attributes}>
      <FolderListItem>{body}</FolderListItem>
      {!props.noChildren && (
        <Box sx={{ p: 1 }}>
          <DndContext
            onDragEnd={props.onDragEnd}
            onDragStart={(e) => setActiveId(e.active.id)}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={props.items || []}>
              <List>
                <Stack spacing={1}>
                  {props.items?.map((item) => (
                    <DndSortItem
                      icon={"file-alt"}
                      key={item.id}
                      sortKey={item.id}
                      label={item.title}
                      variant="item"
                      actions={props.subactions?.(item)}
                    />
                  ))}
                  {(props.items?.length ?? 0) < 1 && (
                    <ListItem>
                      <ListItemText secondary={t("No rows")} />
                    </ListItem>
                  )}
                </Stack>
              </List>
            </SortableContext>
            <DragOverlay>
              {activeId && (
                <DndSortItem
                  icon={"arrows"}
                  sortKey={String(activeId)}
                  label={
                    props.items?.find((item) => item.id === activeId)?.title
                  }
                />
              )}
            </DragOverlay>
          </DndContext>
        </Box>
      )}
    </Folder>
  ) : (
    <ListItemStyled ref={setNodeRef} style={style} {...attributes}>
      {body}
    </ListItemStyled>
  );
};
