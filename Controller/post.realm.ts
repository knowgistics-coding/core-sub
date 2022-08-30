import * as Realm from "realm-web";
import { PageDocument } from "../PageEdit";
import { Document } from "./ske";

export interface PostRealmDocument extends Omit<PageDocument, "visibility"> {
  type: "post";
  user: string;
  visibility: "private" | "public" | "trash";
}
export type PostRealmDocumentOption = Partial<PostRealmDocument>
export type PostRealmData = PostRealmDocument & Document;

export class PostManageRealm {
  static async getMy(user:Realm.User):Promise<PostRealmDocument[]>{
    const result = await user.functions.getMy("post")
    return Array.isArray(result.docs) ? result.docs : []
  }
}
