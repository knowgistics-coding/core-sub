import * as Realm from "realm-web";
import { PageDocument } from "../PageEdit";

export interface PostRealmDocument extends Omit<PageDocument, "visibility"> {
  type: "post";
  user: string;
  visibility: "private" | "public" | "trash";
}
export type PostRealmDocumentOption = {
  [key in keyof PostRealmDocument]?: PostRealmDocument[key];
};
export interface PostRealmData extends PostRealmDocument {
  _id: Realm.BSON.ObjectID;
  id: string;
}

export class PostRealm {
  collection: globalThis.Realm.Services.MongoDB.MongoDBCollection<any>;

  constructor(private user: Realm.User) {
    const mongo = user.mongoClient("mongodb-atlas");
    this.collection = mongo.db("mek").collection("posts");
  }

  private appendId = (doc: PostRealmData): PostRealmData =>
    Object.assign({}, doc, { id: doc._id.toString() });

  async list(): Promise<PostRealmData[]> {
    if (this.user && this.collection) {
      const docs = (
        await this.user.callFunction<PostRealmData[]>("post_get_my")
      ).map((doc: PostRealmData) => this.appendId(doc));
      return docs;
    }
    return [];
  }

  async create(title: string): Promise<PostRealmData | null> {
    if (this.user) {
      const result = await this.user.callFunction<PostRealmData>(
        "post_create",
        title
      );
      return this.appendId(result);
    }
    return null;
  }

  async update(
    id: string,
    field: string,
    value: any
  ): Promise<PostRealmData | null> {
    if (this.user) {
      const post = await this.user.callFunction<PostRealmData>(
        "post_update",
        id,
        field,
        value
      );
      return post;
    }
    return null;
  }

  async remove(id: string): Promise<PostRealmData | null> {
    if (this.user) {
      const post = await this.user.callFunction<PostRealmData>(
        "post_update",
        id,
        "visibility",
        "trash"
      );
      return this.appendId(post);
    }
    return null;
  }

  async removeForever(id: string): Promise<boolean> {
    if (this.collection) {
      const result = await this.user.callFunction<{ deletedCount: number }>(
        "post_remove",
        id
      );
      return Boolean(result.deletedCount);
    }
    return false;
  }

  async restore(id: string): Promise<PostRealmData | null> {
    if (this.collection) {
      const post = await this.user.callFunction<PostRealmData>(
        "post_update",
        id,
        "visibility",
        "private"
      );
      return this.appendId(post);
    }
    return null;
  }
}
