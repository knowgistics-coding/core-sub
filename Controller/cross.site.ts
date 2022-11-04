import { signInWithCustomToken, User } from "firebase/auth";
import { auth } from "./firebase";
import { MainStatic } from "./main.static";

export class CrossSite extends MainStatic {
  static async getCustomToken(
    user: User,
    token: string
  ): Promise<{ token?: string }> {
    return await this.get<{ token?: string }>(
      user,
      `${this.baseUrl()}/user/customtoken/${token}`,
      "GET"
    );
  }

  static async init(user: User, hash: string) {
    const data: Record<string, string> = Object.assign(
      {},
      ...hash
        .slice(1)
        .split("&")
        .map((text) => text.split("="))
        .map((arr) => ({ [arr[0]]: arr[1] }))
    );
    if (data.as && data.redirect) {
      const result = await this.getCustomToken(user, data.as);
      if (result.token) {
        signInWithCustomToken(auth, result.token).then(() => {
          window.location.href = decodeURIComponent(data.redirect);
        });
      }
    }
  }

  static async getSignInLink(user: User, appName:string, path:string): Promise<string|null> {
    if(process.env.REACT_APP_DOMAIN){
      const redirect = encodeURIComponent(`https://${appName}.${process.env.REACT_APP_DOMAIN}${path}`)
      const token = await user.getIdToken();
      const link = `https://${appName}.${process.env.REACT_APP_DOMAIN}/#as=${token}&redirect=${redirect}`;
      return link;
    } else {
      return null
    }
  }
}
