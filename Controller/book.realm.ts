import { StockDisplayProps } from "../StockDisplay";
import { SkeletonRealm } from "./ske.realm";

export type BookRealmContent = {
  key: string
  label: string
  post?: string
  folder?: Omit<BookRealmContent, "folder">[]
  type: 'post' | 'folder'
}
export interface BookRealmData {
  title?: string;
  feature?: StockDisplayProps;
  contents?: BookRealmContent[]
}

export class BookRealm extends SkeletonRealm {
  constructor(readonly token: string) {
    super();
  }

  async list(): Promise<undefined | BookRealmData[]> {
    if (this.app.currentUser) {
      return await this.collection("books")?.find({
        user: this.app.currentUser.id,
        type: "book",
      });
    }
    return;
  }
}
