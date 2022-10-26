import {
  closestCorners,
  DndContext,
  DndContextProps,
  DragCancelEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List, Stack } from "@mui/material";
import * as React from "react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DndSortItem } from "./item";

export type DndSortItemData<T extends unknown> = {
  id: string;
  title: string;
  type: "folder" | "item";
  items?: Omit<DndSortItemData<T>, "items">[];
} & { [Key in keyof T]: T[Key] };

export type DndSortContainerProps<T extends unknown> = Omit<
  DndContextProps,
  "sensors" | "collisionDetection"
> & {
  children: React.ReactNode;
  items: DndSortItemData<T>[];
};

export const DndSortContainer = <T extends unknown>({
  children,
  items,
  ...props
}: DndSortContainerProps<T>) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    props.onDragStart?.(event);
  };
  const handleDragCancel = (event: DragCancelEvent) => {
    setActiveId(null);
    props.onDragCancel?.(event);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToVerticalAxis]}
      {...props}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <List>
          <Stack spacing={1}>{children}</Stack>
        </List>
      </SortableContext>
      <DragOverlay>
        {activeId && (
          <DndSortItem
            icon={"arrows"}
            sortKey={String(activeId)}
            label={items.find((item) => item.id === activeId)?.title ?? ""}
            variant={items.find((item) => item.id === activeId)?.type ?? "item"}
            noChildren
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
