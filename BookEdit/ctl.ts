import { BookContent, BookRawData } from "../Controller";
import { genKey } from "draft-js";
import update from "react-addons-update";
import { PostDocument } from "./post.add";
import { onSnapshot, query, Unsubscribe, where } from "firebase/firestore";
import { ClientPostCtl } from "../../../controllers/client.post";

export class BookEditCtl extends ClientPostCtl {
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
    post: (data: Partial<BookRawData>, title: string): Partial<BookRawData> => {
      return update(data, {
        contents: {
          $apply: (contents: BookContent[] = []) =>
            contents.concat({ key: genKey(), title, type: "post" }),
        },
      });
    },
  };
  static readonly folder = {
    moveOut: (
      data: Partial<BookRawData>,
      folderIndex: number,
      itemIndex: number
    ): Partial<BookRawData> => {
      const item = Object.assign(
        {},
        data?.contents?.[folderIndex]?.items?.[itemIndex],
        {
          key: genKey(),
        }
      );
      if (item) {
        return update(data, {
          contents: {
            [folderIndex]: { items: { $splice: [[itemIndex, 1]] } },
            $apply: (contents) => contents.concat(item),
          },
        });
      }
      return data;
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
  static post = {
    many: (callback: (docs: PostDocument[]) => void): Unsubscribe => {
      return onSnapshot(
        query(this.collection("posts"), where("type", "==", "post")),
        (snapshot) => {
          const docs = snapshot.docs.map((doc) =>
            this.parseDoc<PostDocument>(doc)
          );
          callback(docs);
        }
      );
    },
  };
}
