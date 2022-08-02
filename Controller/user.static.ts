import { User } from "firebase/auth";
import { validateEmail } from "../func";
import { MainStatic } from "./main.static";

export type UserType = Record<
  "email" | "uid" | "displayName" | "photoUrl",
  string
>;

export class UserStatic extends MainStatic {
  static getUserFromEmail(user: User, email: string) {
    return new Promise(async (resolve, reject) => {
      if (validateEmail(email) === false) {
        reject(new Error("Invalid E-mail"));
      }

      this.get<UserType | null>(
        user,
        `${this.baseUrl()}/user/email`,
        "POST",
        JSON.stringify({ email })
      )
        .then((docs) => resolve(docs))
        .catch((err) => reject(new Error(err.message)));
    });
  }
}
