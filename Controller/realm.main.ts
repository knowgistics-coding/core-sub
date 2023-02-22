import { User } from "firebase/auth";
import { App, User as RUser } from "realm-web";

export class RealmMain {
  static appId: string = "slideshow-nooke";

  static CLUSTER_NAME: string = "mongodb-atlas";

  static getUser = (user: User): Promise<RUser> => {
    return new Promise(async (resolve, reject) => {
      const app = new App({ id: this.appId });
      const token = await user.getIdToken();
      const credential = App.Credentials.jwt(token);
      app
        .logIn(credential)
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    });
  };

  static getAnonymous() {
    return new Promise<RUser>(async (resolve, reject) => {
      const app = new App({ id: this.appId });
      const credential = App.Credentials.anonymous();
      app
        .logIn(credential)
        .then((user) => resolve(user))
        .catch(reject);
    });
  }
}
