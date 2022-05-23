import * as Realm from "realm-web";
import { PageDocument } from "../PageEdit";

export interface PostRealmDocument extends Omit<PageDocument, "visibility"> {
  type: "post";
  datecreate: Date;
  datemodified: Date;
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

  private getUid = (): string | null =>
    (this.user?.profile?.user_id as string) || null;

  async getMy(): Promise<PostRealmData[]> {
    if (this.user && this.collection) {
      const docs = (
        await this.collection.find({
          user: this.user.id,
        })
      ).map((doc) =>
        Object.assign({}, doc, { id: doc._id.toString() })
      ) as PostRealmData[];
      return docs;
    }
    return [];
  }

  async create(title: string): Promise<PostRealmData[]> {
    if (this.getUid() && this.collection) {
      await this.collection.insertOne({
        title,
        datecreate: new Date(),
        datemodified: new Date(),
        user: this.user.id,
        user_id: this.getUid(),
        visibility: "private",
        type: "post",
      } as PostRealmDocument);
      return await this.getMy();
    }
    return [];
  }

  async remove(_id: PostRealmData["_id"]): Promise<PostRealmData[]> {
    if (this.collection) {
      const updateData: PostRealmDocumentOption = {
        datemodified: new Date(),
        visibility: "trash",
      };
      await this.collection.updateOne({ _id }, { $set: updateData });
      return await this.getMy();
    }
    return [];
  }

  async removeForever(_id: PostRealmData["_id"]): Promise<PostRealmData[]> {
    if (this.collection) {
      await this.collection.deleteOne({ _id });
      return await this.getMy();
    }
    return [];
  }

  async restore(_id: PostRealmData["_id"]): Promise<PostRealmData[]> {
    if (this.collection) {
      const updateData: PostRealmDocumentOption = {
        datemodified: new Date(),
        visibility: "private",
      };
      await this.collection.updateOne({ _id }, { $set: updateData });
      return await this.getMy();
    }
    return [];
  }
}
