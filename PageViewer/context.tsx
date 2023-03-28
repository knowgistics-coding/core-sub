import { Breakpoint } from "@mui/material";
import { createContext, ReactNode } from "react";
import { ContentHeaderProps } from "../ContentHeader";
import { PageDoc } from "../Controller/page";
import { MainContainerProps } from "../MainContainer";

export interface PageViewerProps {
  data: PageDoc;
  children?: React.ReactNode;
  maxWidth?: Breakpoint;
  breadcrumbs?: ContentHeaderProps["breadcrumbs"];
  mainContainerProps?: Omit<MainContainerProps, "children">;
  noContainer?: boolean;
  post?: boolean;
  overrideHeader?: ReactNode;
}

export interface PageViewerContextType extends PageViewerProps {}
export const PageViewerContext = createContext<PageViewerContextType>({
  data: new PageDoc(),
});
