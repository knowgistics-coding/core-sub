import { User as FBUser } from "firebase/auth";
import { MainStatic } from "./main.static";
import { ExcludeMethods } from "./map";

export class User extends MainStatic {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;

  constructor(
    data: Partial<Pick<User, "displayName" | "photoURL">> &
      Pick<User, "email" | "uid">
  ) {
    super();

    this.displayName = data.displayName ?? "";
    this.email = data.email;
    this.photoURL = data.photoURL ?? "";
    this.uid = data.uid;
  }

  toJSON(): ExcludeMethods<this> {
    return Object.assign(
      {},
      ...Object.entries(this)
        .filter(([_key, value]) => typeof value !== "function")
        .map(([key, value]) => ({ [key]: value }))
    );
  }

  static async getUsers(user: FBUser, uids: string[]): Promise<User[]> {
    const result = await this.get<User[]>(
      user,
      `${this.baseUrl()}/user/list`,
      "POST",
      JSON.stringify({ uids })
    );
    return result.map((doc) => new User(doc));
  }
  static async getUsersDict(
    user: FBUser,
    uids: string[]
  ): Promise<Record<string, User>> {
    const result = await this.getUsers(user, uids);
    return Object.assign(
      {},
      ...result.map((doc) => ({ [doc.uid]: new User(doc) }))
    );
  }
  static async getUserFromEmail(user: FBUser, email: string): Promise<User> {
    const result = await this.get<User>(
      user,
      `${this.baseUrl()}/user/email`,
      "POST",
      JSON.stringify({
        email,
      })
    );
    return result;
  }

  static async getInfo(
    uid: string
  ): Promise<User> {
    const result = await fetch(
      `${this.baseUrl()}/user/info/${uid}`
    ).then((res) => res.json());
    return new User(result);
  }
}
