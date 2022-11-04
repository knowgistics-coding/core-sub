import { arrayMoveImmutable } from "array-move";
import { genKey } from "draft-js";
import { DataGridEditorData } from "../DataGridEditor";
import { StockDisplayProps } from "../StockDisplay";
import { VideoContent } from "../VideoDisplay";
import update from "react-addons-update";
import { StockImageTypes } from "../StockPicker";
import { ShowTypes, SlideItem } from "../Controller/page";

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
  id: string;
  title: string;
  feature: StockDisplayProps | null;
  contents: PageContentTypes[];
  visibility: "private" | "public" | "trash";
}

export class PageEditData {
  title: string;
  feature: StockDisplayProps | null;
  contents: PageContentTypes[];
  visibility: "private" | "public" | "trash";

  constructor(data?: Partial<PageDocument>) {
    this.title = data?.title || "";
    this.feature = data?.feature || null;
    this.contents = data?.contents || [];
    this.visibility = data?.visibility || "private";
  }

  toJSON(): Omit<PageDocument, "id"> {
    return {
      title: this.title,
      feature: this.feature,
      contents: this.contents,
      visibility: this.visibility,
    };
  }

  private readonly getIndex = (key: string): number =>
    this.contents.findIndex((content) => content.key === key);

  readonly content = {
    getKeys: (): string[] => this.contents.map((content) => content.key),
    add: (type: ShowTypes): PageEditData => {
      this.contents = this.contents.concat({ type, key: genKey() });
      return this;
    },
    insert: (key: string, type: ShowTypes): PageEditData => {
      const index = this.getIndex(key);
      if (index > -1) {
        this.contents.splice(index, 0, { type, key: genKey() });
      }
      return this;
    },
    remove: (keys: string[]): PageEditData => {
      this.contents = this.contents.filter(
        (content) => !keys.includes(content.key)
      );
      return this;
    },
    sorting: (oldIndex: number, newIndex: number): PageEditData => {
      this.contents = arrayMoveImmutable(this.contents, oldIndex, newIndex);
      return this;
    },
    update: <
      Key extends keyof Omit<PageContentTypes, "key" | "type" | "mt" | "mb">
    >(
      key: string,
      field: Key,
      value: PageContentTypes[Key]
    ): PageEditData => {
      const index = this.getIndex(key);
      if (index > -1) {
        this.contents = update(this.contents, {
          [index]: {
            [field]: { $apply: (data: any) => Object.assign({}, data, value) },
          },
        });
      }
      return this;
    },
    batchUpdate: (
      keys: string[],
      data: Partial<PageContentTypes>
    ): PageEditData => {
      this.contents = this.contents.map((content) => {
        if (keys.includes(content.key)) {
          return update(content, { $merge: data });
        } else {
          return content;
        }
      });
      return this;
    },
    convertToParagraph: (key: string): PageEditData => {
      const index = this.getIndex(key);
      if (index > -1) {
        this.contents = update(this.contents, {
          [index]: {
            $merge: {
              type: "paragraph",
              paragraph: {
                value: this.contents[index].heading?.value,
              },
            },
          },
        });
      }
      return this;
    },
  };

  readonly paragraph = {
    enter: (
      key: string,
      paragraphs: string[],
      callback: (lastKey: string) => void
    ): PageEditData => {
      const index = this.getIndex(key);
      if (index > -1) {
        const newParagraphs: PageContentTypes[] = paragraphs.map((value) => ({
          key: genKey(),
          type: "paragraph",
          paragraph: { value },
        }));
        this.contents.splice(index, 1, ...newParagraphs);
        callback(newParagraphs[newParagraphs.length - 1].key);
      }
      return this;
    },
    convertToHeading: (key: string): PageEditData => {
      const index = this.getIndex(key);
      if (index > -1) {
        this.contents = update(this.contents, {
          [index]: {
            $merge: {
              type: "heading",
              heading: {
                value: this.contents[index].paragraph?.value,
              },
            },
          },
        });
      }
      return this;
    },
  };

  static parseImage([image]: StockImageTypes[]): StockDisplayProps | undefined {
    if (image) {
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
}
