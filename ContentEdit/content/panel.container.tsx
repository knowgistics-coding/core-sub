import { HTMLAttributes } from "react";
import { SortableContainer } from "react-sortable-hoc";

export const PanelContainer = SortableContainer<HTMLAttributes<HTMLDivElement>>(
  (props: HTMLAttributes<HTMLDivElement>) => <div {...props} />
);
