import { Timestamp } from "firebase/firestore";
import { DataGridEditorData } from "../DataGridEditor";
import { SlideItem } from "../PageEdit";
import { PageDocument } from "../PageEdit/ctl";
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

export type PageDate = Timestamp | Date | number | undefined;

export class PageDoc {
  title: string;
  feature: StockDisplayProps | null;
  contents: PageContentTypes[];
  visibility: VisibilityTabsValue;
  user: string;
  datecreate: number;
  datemodified: number;

  constructor(
    data?: Partial<Omit<PageDoc, "datecreate" | "datemodified">> & {
      datecreate?: PageDate;
      datemodified?: PageDate;
    }
  ) {
    this.title = data?.title ?? "";
    this.feature = data?.feature ?? null;
    this.contents = data?.contents ?? [];
    this.visibility = data?.visibility ?? "private";
    this.user = data?.user || "";
    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);
  }

  private dateToNumber(date?: PageDate): number {
    if (date instanceof Date) {
      return date.getTime();
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else if (typeof date === "number") {
      return date;
    } else {
      return Date.now();
    }
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  toJSON(): Omit<PageDocument, "id"> {
    return {
      title: this.title,
      feature: this.feature,
      contents: this.contents,
      visibility: this.visibility,
    };
  }
}
