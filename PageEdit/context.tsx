import { DataGridEditorData } from "../DataGridEditor";
import { ContainerProps } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import React, { createContext, ReactNode, useContext } from "react";
import { ContentHeaderProps } from "../ContentHeader";
import { MainContainerProps } from "../MainContainer";
import { StockDisplayProps } from "../StockDisplay";
import { VideoContent } from "../VideoDisplay";

export type ShowTypes =
  | "title"
  | "feature"
  | "visibility"
  | "heading"
  | "paragraph"
  | "image"
  | "video"
  | "cover"
  | "slide"
  | "highlight"
  | "card"
  | "book"
  | "table"
  | "divider"
  | "file";

export type PostOptions = {
  id: string;
  title: string;
  type: string;
  feature?: StockDisplayProps;
};

export interface SlideItem {
  feature?: StockDisplayProps;
  title?: string;
  id?: string;
  link?: { from?: "url" | "post" | "book" | "page"; value?: string };
}

export interface PageContentTypes {
  key: string;
  type: ShowTypes;
  heading?: {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    align?: "left" | "right" | "center";
    value?: string;
  };
  paragraph?: {
    value?: string;
  };
  image?: StockDisplayProps;
  video?: VideoContent;
  cover?: StockDisplayProps;
  slide?: SlideItem[];
  table?: DataGridEditorData;
  mt?: number;
  mb?: number;
}
export interface PageDocument {
  _id?: string;
  title?: string;
  feature?: StockDisplayProps | null;
  contents?: PageContentTypes[];
  visibility?: "private" | "public" | "trash";
  user?: string;
  datecreate?: Timestamp | Date | number;
  datemodified?: Timestamp | Date | number;
}

export interface PageEditProps {
  data: PageDocument;
  show: ShowTypes[];
  setData: React.Dispatch<React.SetStateAction<PageDocument>>;
  onSave: () => Promise<boolean> | boolean;

  children?: React.ReactNode;
  back?: string;
  maxWidth?: ContainerProps["maxWidth"];
  breadcrumbs?: ContentHeaderProps["breadcrumbs"];
  mainContainerProps?: Omit<MainContainerProps, "children" | "sidebar">;
  onPreview?: () => void;
  sidebarActions?: React.ReactNode;
  prefix?: string;
  linkRender?: (
    from: "url" | "post" | "book" | "page",
    value: string
  ) => string;
  staticTitle?: ReactNode;
}

export interface PageEditStateTypes {
  loading: boolean;
  focus: string | null;
  hideToolbar: boolean;
  remove: number;
  selected: string[];
  insert: string | null
}

export interface PEContextTypes extends Omit<PageEditProps, "postOptions"> {
  state: PageEditStateTypes;
  setState: React.Dispatch<React.SetStateAction<PageEditStateTypes>>;
}
export const PEContext = createContext<PEContextTypes>({
  data: {},
  setData: () => {},
  show: [],
  onSave: () => true,
  state: {
    loading: true,
    focus: null,
    hideToolbar: false,
    remove: -1,
    selected: [],
    insert: null,
  },
  setState: () => {},
});

export const usePE = () => useContext(PEContext);
