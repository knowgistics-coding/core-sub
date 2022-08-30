import { User } from "firebase/auth";
import * as Realm from "realm-web";
import { realmApp } from "../../../controllers/realm";

export type RealmUser = Realm.User;

export class RealmStatic {
  static async signIn(user: User): Promise<RealmUser> {
    const token = await user.getIdToken();
    const realmUser = realmApp.logIn(Realm.Credentials.jwt(token));
    return realmUser;
  }
  static async signOut(user:RealmUser){
    return await user.logOut()
  }
}
