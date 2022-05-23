import * as Realm from "realm-web";

export class WebRealm {
  collection?: globalThis.Realm.Services.MongoDB.MongoDBCollection<any>;

  constructor(private user: Realm.User) {
    const mongo = user.mongoClient("mongodb-atlas");
    this.collection = mongo.db("mek").collection("websites");
  }

  async getMy() {
    if (this.collection) {
      const snap = await this.collection.find({
        user: this.user.customData.user_id,
      });
      return snap
    }
    return [];
  }
}
