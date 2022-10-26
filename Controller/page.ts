import { DataGridEditorData } from "../DataGridEditor";
import { SlideItem } from "../PageEdit";
import { StockDisplayProps } from "../StockDisplay";
import { VideoContent } from "../VideoDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";

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

export class PageDoc {
  title: string;
  feature: StockDisplayProps | null;
  contents: PageContentTypes[];
  visibility: VisibilityTabsValue;
  user: string;
  datecreate: number;
  datemodified: number;

  constructor(data?: Partial<PageDoc>) {
    this.title = data?.title ?? "";
    this.feature = data?.feature ?? null;
    this.contents = data?.contents ?? [];
    this.visibility = data?.visibility ?? "private";
    this.user = data?.user || "";
    this.datecreate = data?.datecreate ?? Date.now();
    this.datemodified = data?.datemodified ?? Date.now();
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }
}
