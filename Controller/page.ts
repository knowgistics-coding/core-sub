import { arrayMoveImmutable } from "array-move";
import { genKey } from "draft-js";
import { Timestamp } from "firebase/firestore";
import update from "react-addons-update";
import { DataGridEditorData } from "../DataGridEditor";
import { PageDocument } from "../PageEdit/ctl";
import { StockDisplayProps } from "../StockDisplay";
import { StockImageTypes } from "../StockPicker";
import { VideoContent } from "../VideoDisplay";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { MekFile } from "./file";
import { Map, MapJson } from "./map";

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
  | "file"
  | "maps";

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
  file?: MekFile;
  mt?: number;
  mb?: number;
}

export type PageDate = Timestamp | Date | number | undefined;
export type PageDocInitType = Partial<
  Omit<PageDoc, "datecreate" | "datemodified">
> & {
  datecreate?: PageDate;
  datemodified?: PageDate;
};

export class PageDoc {
  title: string;
  feature: StockDisplayProps | null;
  contents: PageContentTypes[];
  maps: Map[];
  visibility: VisibilityTabsValue;
  user: string;
  datecreate: number;
  datemodified: number;

  stamp: string;

  constructor(data?: PageDocInitType) {
    this.title = data?.title ?? "";
    this.feature = data?.feature ?? null;
    this.contents = data?.contents ?? [];
    this.maps = data?.maps?.map((doc) => new Map(doc)) ?? [];

    this.visibility = data?.visibility ?? "private";
    this.user = data?.user || "";
    this.datecreate = this.dateToNumber(data?.datecreate);
    this.datemodified = this.dateToNumber(data?.datemodified);

    this.stamp = genKey();
  }

  stamping() {
    this.stamp = genKey();
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

  /**
   * ==================================================
   *    ____               _                _
   *   / ___| ___   _ __  | |_  ___  _ __  | |_
   *  | |    / _ \ | '_ \ | __|/ _ \| '_ \ | __|
   *  | |___| (_) || | | || |_|  __/| | | || |_
   *   \____|\___/ |_| |_| \__|\___||_| |_| \__|
   *
   * ==================================================
   */

  contentAdd(type: ShowTypes): this {
    this.contents = this.contents.concat({ type, key: genKey(), mb: 2, mt: 0 });
    return this;
  }

  contentSet<T extends keyof PageContentTypes>(
    key: string,
    field: T,
    value: PageContentTypes[T]
  ): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index][field] = value;
    }
    return this;
  }

  contentMerge<T extends keyof PageContentTypes>(
    key: string,
    field: T,
    value: Partial<PageContentTypes[T]>
  ): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index] = update(this.contents[index], {
        [field]: {
          $apply: (data?: Partial<PageContentTypes[T]>) =>
            Object.assign(data ?? {}, value),
        },
      });
    }
    return this;
  }

  contentInsert(key: string, type: ShowTypes): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents.splice(index, 0, { type, key: genKey() });
    }
    return this;
  }

  contentMoved(oldIndex: number, newIndex: number): this {
    this.contents = arrayMoveImmutable(this.contents, oldIndex, newIndex);
    return this;
  }

  contentRemoved(key: string | string[]): this {
    this.contents = this.contents.filter(
      (content) =>
        (Array.isArray(key) ? key : [key]).includes(content.key) === false
    );
    return this;
  }

  contentSpaceSizing(key: string, top?: number, bottom?: number): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index].mt = top ?? 0;
      this.contents[index].mb = bottom ?? 0;
    }
    return this;
  }

  contentSpaceBatch(selection: string[], top?: number, bottom?: number): this {
    selection.forEach((key) => this.contentSpaceSizing(key, top, bottom));
    return this;
  }

  contentSorting(oldIndex: number, newIndex: number): this {
    this.contents = arrayMoveImmutable(this.contents, oldIndex, newIndex);
    return this;
  }

  contentGetKeys(): string[] {
    return this.contents.map((content) => content.key);
  }

  /**
   * ============================================================
   *   ____                                               _
   *  |  _ \  __ _  _ __  __ _   __ _  _ __  __ _  _ __  | |__
   *  | |_) |/ _` || '__|/ _` | / _` || '__|/ _` || '_ \ | '_ \
   *  |  __/| (_| || |  | (_| || (_| || |  | (_| || |_) || | | |
   *  |_|    \__,_||_|   \__,_| \__, ||_|   \__,_|| .__/ |_| |_|
   *                            |___/             |_|
   * ============================================================
   */

  paragraphEnter(key: string, paragraphs: string[], focus?: (key:string) => void): this {
    const index = this.findIndex(key);
    if (index > -1) {
      const newParagraphs: PageContentTypes[] = paragraphs.map((value) => ({
        key: genKey(),
        type: "paragraph",
        paragraph: { value },
      }));
      if(newParagraphs.length > 0){
        const key = newParagraphs.slice(-1)[0].key
        if(key){
          focus?.(key)
        }
      }
      this.contents.splice(index, 1, ...newParagraphs);
    }
    return this;
  }

  paragraphToHeading(key: string) {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index].type = "heading";
      this.contents[index].heading = {
        value: this.contents[index].paragraph?.value,
      };
    }
    return this;
  }

  /**
   * ==================================================
   *   _   _                   _  _
   *  | | | |  ___   __ _   __| |(_) _ __    __ _
   *  | |_| | / _ \ / _` | / _` || || '_ \  / _` |
   *  |  _  ||  __/| (_| || (_| || || | | || (_| |
   *  |_| |_| \___| \__,_| \__,_||_||_| |_| \__, |
   *                                        |___/
   * ==================================================
   */

  headingToParagraph(key: string): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index].type = "paragraph";
      this.contents[index].paragraph = {
        value: this.contents[index].heading?.value,
      };
    }
    return this;
  }

  /**
   * ==============================
   *   ____   _  _      _
   *  / ___| | |(_)  __| |  ___
   *  \___ \ | || | / _` | / _ \
   *   ___) || || || (_| ||  __/
   *  |____/ |_||_| \__,_| \___|
   *
   * ==============================
   */
  slideAdd(key: string, data: SlideItem): this {
    const index = this.findIndex(key);
    if (index > -1) {
      this.contents[index].slide = (this.contents[index].slide || []).concat(
        data
      );
    }
    return this;
  }

  /**
   * ==============================
   *   __  __
   *  |  \/  |  __ _  _ __   ___
   *  | |\/| | / _` || '_ \ / __|
   *  | |  | || (_| || |_) |\__ \
   *  |_|  |_| \__,_|| .__/ |___/
   *                 |_|
   * ==============================
   */

  mapAdd(map: Map | Map[]): this {
    this.maps = this.maps
      .concat(map)
      .filter(
        (map, index, maps) => maps.findIndex((m) => m.id === map.id) === index
      );
    return this;
  }

  mapRemove(key: string): this {
    this.maps = this.maps.filter((map) => map.id !== key);
    return this;
  }

  private findIndex(key: string): number {
    return this.contents.findIndex((content) => content.key === key);
  }

  toJSON(): Omit<PageDocument, "id" | "maps"> & { maps: MapJson[] } {
    return {
      title: this.title,
      feature: this.feature,
      contents: this.contents,
      visibility: this.visibility,
      maps: this.maps.map((map) => map.toJSON()),
    };
  }

  static parseImage(image: StockImageTypes): StockDisplayProps | undefined {
    const { blurhash, _id, width, height, credit } = image;
    const ratio = width && height ? height / width : undefined;
    const newImage: StockDisplayProps["image"] = {
      blurhash,
      _id,
      width,
      height,
      credit,
    };
    return { image: newImage, ratio };
  }
}
