import { StockDisplayProps } from "../StockDisplay";
import { VisibilityValue } from "../Visibility";
import { Document, SkeMongo } from "./ske";

export type BookRealmContent = {
  key: string;
  label: string;
  post?: string;
  folder?: Omit<BookRealmContent, "folder">[];
  type: "post" | "folder";
};
export interface BookRealmData {
  title?: string;
  feature?: StockDisplayProps;
  contents?: BookRealmContent[];
  visibility?: VisibilityValue;
}
export type BookDocument = BookRealmData & Document;

export class BookRealm extends SkeMongo {
  async getOne(id: string): Promise<BookRealmData | null> {
    const book = await this.get<BookRealmData>(
      `${this.baseUrl}/book/${id}`,
      "GET"
    );
    return book;
  }

  async list(): Promise<BookDocument[]> {
    const docs = await this.get<BookDocument[]>(
      `${this.baseUrl}/book/my`,
      "GET"
    );
    return docs;
  }

  async create(data: BookRealmData): Promise<BookDocument> {
    return await this.get<BookDocument>(
      `${this.baseUrl}/book`,
      "PUT",
      JSON.stringify(data)
    );
  }

  async update(id: string, data: BookRealmData): Promise<BookDocument> {
    return await this.get<BookDocument>(
      `${this.baseUrl}/book/${id}`,
      "PATCH",
      JSON.stringify(data)
    );
  }

  async remove(id: string): Promise<boolean> {
    return await this.get<boolean>(`${this.baseUrl}/book/${id}`, "DELETE");
  }
}
