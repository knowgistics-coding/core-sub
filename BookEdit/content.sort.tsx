import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookContent, BookContentItem } from "../Controller/book";
import {
  Box,
  BoxProps,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
import { PickIcon } from "../PickIcon";
import ActionIcon from "../ActionIcon";
import { MouseEvent, useState } from "react";
import update from "react-addons-update";

//SECTION - Item
const Item = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  height: 56,
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
}));
//!SECTION

//SECTION - SortableItem
export type SortableItemProps = {
  data: BookContent;
  onMenu?: (
    item: BookContent,
    child?: BookContentItem
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
};
export const SortableItem = (props: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.data.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item ref={setNodeRef} style={style} {...attributes}>
      <ListItemIcon>
        <PickIcon icon="file-alt" />
      </ListItemIcon>
      <ListItemText primary={props.data.title} />
      <Stack direction="row">
        <ActionIcon
          icon="ellipsis-v"
          color="default"
          onClick={props.onMenu?.(props.data)}
        />
        <ActionIcon icon="grip-dots-vertical" color="default" {...listeners} />
      </Stack>
    </Item>
  );
};
//!SECTION

//SECTION - SortableItemChild
export type SortableItemChildProps = {
  data: BookContentItem;
  onMenu?: (event: MouseEvent<HTMLButtonElement>) => void;
};
export const SortableItemChild = (props: SortableItemChildProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.data.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item ref={setNodeRef} style={style} {...attributes}>
      <ListItemIcon>
        <PickIcon icon="file-alt" />
      </ListItemIcon>
      <ListItemText primary={props.data.title} />
      <Stack direction="row">
        <ActionIcon icon="ellipsis-v" color="default" onClick={props.onMenu} />
        <ActionIcon icon="grip-dots-vertical" color="default" {...listeners} />
      </Stack>
    </Item>
  );
};
//!SECTION

//SECTION - SortableFolder
const Folder = styled(Item)(({ theme }) => ({
  backgroundColor: theme.palette.grey[700],
  color: theme.palette.primary.contrastText,
}));
const FolderWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
  border: `solid 1px ${theme.palette.grey[700]}`,
  borderTop: "none",
}));
export const SortableFolder = (
  props: SortableItemProps & {
    onChildSortEnd: (items: BookContentItem[]) => void;
  }
) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.data.key });
  const [active, setActive] = useState<BookContentItem | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSortEnd = ({ active, over }: DragEndEvent) => {
    if (props.data?.items && over && active.id !== over.id) {
      const oldIndex = props.data.items.findIndex((i) => i.key === active.id);
      const newIndex = props.data.items.findIndex((i) => i.key === over.id);
      const items = arrayMove(props.data.items, oldIndex, newIndex);
      props.onChildSortEnd(items);
    }
  };
  const handleDragStart = ({ active: { id } }: DragStartEvent) => {
    const item = props.data?.items?.find((i) => i.key === id);
    if (item) {
      setActive(item);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Folder>
        <ListItemIcon>
          <PickIcon icon="folder" />
        </ListItemIcon>
        <ListItemText primary={props.data.title} />
        <Stack direction="row">
          <ActionIcon
            icon="ellipsis-v"
            color="default"
            onClick={props.onMenu?.(props.data)}
          />
          <ActionIcon
            icon="grip-dots-vertical"
            color="default"
            {...listeners}
          />
        </Stack>
      </Folder>
      <FolderWrapper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSortEnd}
          onDragStart={handleDragStart}
          onDragCancel={() => setActive(null)}
        >
          <SortableContext
            items={(props.data?.items ?? []).map((item) => item.key)}
            strategy={verticalListSortingStrategy}
          >
            <Stack spacing={0.5}>
              {(props.data?.items ?? []).map((item) => (
                <SortableItemChild
                  key={item.key}
                  data={item}
                  onMenu={props.onMenu?.(props.data, item)}
                />
              ))}
            </Stack>
          </SortableContext>
          <DragOverlay>
            {active && (
              <SortItemOverlay type="item">{active.title}</SortItemOverlay>
            )}
          </DragOverlay>
        </DndContext>
      </FolderWrapper>
    </div>
  );
};
//!SECTION

//SECTION - SortItemOverlay
const SortItemOverlay = styled(
  ({ type, ...props }: BoxProps & { type: BookContent["type"] }) => (
    <Box {...props}>
      <ListItemIcon>
        <PickIcon icon={type === "folder" ? "folder" : "file-alt"} />
      </ListItemIcon>
      <ListItemText primary={props.children} />
    </Box>
  )
)(({ theme }) => ({
  height: 56,
  backgroundColor: theme.palette.warning.main,
  padding: theme.spacing(1, 2),
  border: `solid 1px ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));
//!SECTION

//SECTION - BookEditContentSorting
export type BookEditContentSortingProps = {
  items: BookContent[];
  onChange: (items: BookContent[]) => void;
  onMenu?: (
    item: BookContent,
    child?: BookContentItem
  ) => (event: MouseEvent<HTMLButtonElement>) => void;
};
export const BookEditContentSorting = (props: BookEditContentSortingProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [active, setActive] = useState<BookContent | null>(null);

  const handleDragStart = ({ active: { id } }: DragStartEvent) => {
    const item = props.items.find((i) => i.key === id);
    if (item) {
      setActive(item);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = props.items.findIndex((i) => i.key === active.id);
      const newIndex = props.items.findIndex((i) => i.key === over.id);
      const newArray = arrayMove(props.items, oldIndex, newIndex);
      props.onChange(newArray);
    }
  };
  const handleChildSortEnd =
    (item: BookContent) => (items: BookContentItem[]) => {
      const index = props.items.findIndex((i) => i.key === item.key);
      if (index > -1) {
        props.onChange(
          update(props.items, { [index]: { items: { $set: items } } })
        );
      }
    };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={() => setActive(null)}
    >
      <SortableContext
        items={props.items.map((item) => item.key)}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={0.5}>
          {props.items.map((item) => {
            switch (item.type) {
              case "item":
                return (
                  <SortableItem
                    data={item}
                    onMenu={props?.onMenu}
                    key={item.key}
                  />
                );
              case "folder":
                return (
                  <SortableFolder
                    data={item}
                    onMenu={props?.onMenu}
                    onChildSortEnd={handleChildSortEnd(item)}
                    key={item.key}
                  />
                );
              default:
                return null;
            }
          })}
        </Stack>
      </SortableContext>
      <DragOverlay>
        {active && (
          <SortItemOverlay type={active.type}>{active.title}</SortItemOverlay>
        )}
      </DragOverlay>
    </DndContext>
  );
};
//!SECTION
