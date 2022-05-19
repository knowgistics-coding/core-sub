import { Breakpoint } from "@mui/material";
import { createContext } from "react";
import { ContentHeaderProps } from "../ContentHeader";
import { MainContainerProps } from "../MainContainer";
import { PageDocument } from "../PageEdit";

export interface PageViewerProps {
  data: PageDocument;
  children?: React.ReactNode;
  maxWidth?: Breakpoint;
  breadcrumbs?: ContentHeaderProps["breadcrumbs"];
  mainContainerProps?: Omit<MainContainerProps, "children">;
  noContainer?: boolean;
  post?: boolean;
}

export interface PageViewerContextType extends PageViewerProps {}
export const PageViewerContext = createContext<PageViewerContextType>({
  data: {},
});
