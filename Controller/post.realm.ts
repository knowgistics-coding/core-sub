import { PageDocument } from "../PageEdit";
import { Document, SkeMongo } from "./ske";

export interface PostRealmDocument extends Omit<PageDocument, "visibility"> {
  type: "post";
  user: string;
  visibility: "private" | "public" | "trash";
}
export type PostRealmDocumentOption = {
  [key in keyof PostRealmDocument]?: PostRealmDocument[key];
};
export type PostRealmData = PostRealmDocument & Document

export class PostRealm extends SkeMongo {
  async list(): Promise<PostRealmData[]> {
    const posts = await this.get<PostRealmData[]>(
      `${this.baseUrl}/post/my`,
      "GET"
    );
    return posts;
  }

  async create(title: string): Promise<PostRealmData | null> {
    const post = await this.get<PostRealmData>(
      `${this.baseUrl}/post`,
      "PUT",
      JSON.stringify({
        title,
      })
    );
    return post;
  }

  async update(
    id: string,
    field: string,
    value: any
  ): Promise<PostRealmData | null> {
    const post = await this.get<PostRealmData>(
      `${this.baseUrl}/post/${id}`,
      "PATCH",
      JSON.stringify({
        data: {
          [field]: value,
        },
      })
    );
    return post;
  }

  async updateData(
    id: string,
    data: PostRealmDocumentOption
  ): Promise<PostRealmDocument> {
    const post = await this.get<PostRealmData>(
      `${this.baseUrl}/post/${id}`,
      "PATCH",
      JSON.stringify({ data })
    );
    return post;
  }

  async remove(id: string): Promise<PostRealmData | null> {
    const post = await this.get<PostRealmData>(
      `${this.baseUrl}/post/${id}`,
      "PATCH",
      JSON.stringify({
        data: {
          visibility: "trash",
        },
      })
    );
    return post;
  }

  async removeForever(id: string): Promise<boolean> {
    const result = await this.get<boolean>(
      `${this.baseUrl}/post/${id}`,
      "DELETE"
    );
    return result;
  }

  async restore(id: string): Promise<PostRealmData | null> {
    const post = await this.get<PostRealmData>(
      `${this.baseUrl}/post/${id}`,
      "PATCH",
      JSON.stringify({
        data: {
          visibility: "private",
        },
      })
    );
    return post;
  }
}
