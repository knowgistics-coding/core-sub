import * as Realm from "realm-web";

export class SkeletonRealm {
  protected appId: string = "kws-realm-royfw";
  protected app: Realm.App = new Realm.App(this.appId);

  collection = (collectionName:string):(globalThis.Realm.Services.MongoDB.MongoDBCollection<any>|undefined) => {
    const col = this.app.currentUser?.mongoClient('mongodb-atlas').db("mek").collection(collectionName)
    return col
  }

  signIn = async (token: string) => {
    const credentials = Realm.Credentials.jwt(token);
    await this.app.logIn(credentials);
    return this.app.currentUser;
  };

  signOut = async () => {
    await this.app.currentUser?.logOut();
    return this.app.currentUser
  }
}
