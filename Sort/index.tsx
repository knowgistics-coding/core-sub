import React, {
  ForwardRefExoticComponent,
  HTMLAttributeAnchorTarget,
} from "react";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
  SortEvent,
} from "react-sortable-hoc";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemProps,
  ListProps,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkProps } from "react-router-dom";

const SortHandle = SortableHandle(() => (
  <IconButton size="small">
    <FontAwesomeIcon icon={["far", "bars"]} />
  </IconButton>
));

export interface SortListItemProps {
  children: React.ReactNode;
  listItemProps?: ListItemProps;
}
export const SortListItem = SortableElement<SortListItemProps>(
  ({ children, listItemProps }:SortListItemProps) => (
    <ListItem ContainerComponent="div" {...listItemProps}>
      <ListItemIcon>
        <SortHandle />
      </ListItemIcon>
      {children}
    </ListItem>
  )
);

export interface SortListItemLinkProps {
  children: React.ReactNode;
  listItemButtonProps?: ListItemButtonProps;
  Link: ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >;
  to: string;
  target?: HTMLAttributeAnchorTarget;
}
export const SortListItemLink = SortableElement(
  ({
    children,
    Link,
    to,
    target,
    listItemButtonProps,
  }: SortListItemLinkProps) => (
    <Link to={to} target={target}>
      <ListItemButton {...listItemButtonProps}>
        <ListItemIcon>
          <SortHandle />
        </ListItemIcon>
        {children}
      </ListItemButton>
    </Link>
  )
);

const SortList = SortableContainer<ListProps>((props: ListProps) => {
  return <List disablePadding {...props} />;
});

export interface SortableProps {
  docs: any[];
  onSortEnd: (data: SortEnd, event: SortEvent) => void;
  component: (doc: any, index: number, docs:any[]) => JSX.Element;
  divider?: boolean;
}
export const Sortable = ({
  docs,
  onSortEnd,
  component,
  ...props
}: SortableProps) => {
  return (
    <SortList onSortEnd={onSortEnd} useDragHandle>
      {props.divider && <Divider />}
      {docs.map((doc, index, docs) => component(doc, index, docs))}
    </SortList>
  );
};
