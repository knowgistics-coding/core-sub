import { BookContent, BookRawData } from "../Controller";
import { genKey } from "draft-js";
import update from "react-addons-update";

export class BookEditCtl {
  static readonly add = {
    folder: (
      data: Partial<BookRawData>,
      title: string
    ): Partial<BookRawData> => {
      return update(data, {
        contents: {
          $apply: (contents: BookContent[] = []) =>
            contents.concat({ key: genKey(), title, type: "folder" }),
        },
      });
    },
  };
  static readonly remove = {
    item: (data: Partial<BookRawData>, key: string): Partial<BookRawData> => {
      const index = data.contents?.findIndex((doc) => doc.key === key);
      return typeof index === "number" && index > -1
        ? update(data, { contents: { $splice: [[index, 1]] } })
        : data;
    },
    sub: (
      data: Partial<BookRawData>,
      folderIndex: number,
      itemIndex: number
    ): Partial<BookRawData> => {
      return update(data, {
        contents: { [folderIndex]: { items: { $splice: [[itemIndex, 1]] } } },
      });
    },
  };
}
