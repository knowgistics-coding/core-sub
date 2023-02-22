import { User } from "firebase/auth";
import { App, User as RUser, BSON } from "realm-web";
import { Slideshow, SlideshowConstructorValue, SlideshowVal } from "./slideshow";

export class RealmSlide extends Slideshow {
  _id: BSON.ObjectId | null;

  constructor(
    data?: Partial<SlideshowConstructorValue & Pick<RealmSlide, "_id">>
  ) {
    super(data);
    this._id = data?._id ?? null;
  }

  private static appId: string = "slideshow-nooke";
  private static CLUSTER_NAME: string = "mongodb-atlas";
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

  static create(user: User, title: string): Promise<RealmSlide> {
    return new Promise<RealmSlide>(async (resolve, reject) => {
      const doc = new RealmSlide({ title, user: user.uid });
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .insertOne(doc.val())
        .then(({ insertedId }) => {
          const result = new RealmSlide({ ...doc.val(), _id: insertedId });
          resolve(result);
        })
        .catch((error) => reject(error));
    });
  }

  static updateField<T extends keyof RealmSlide>(
    user: User,
    doc: RealmSlide,
    field: T,
    value: RealmSlide[T]
  ) {
    return new Promise<RealmSlide>(async (resolve, reject) => {
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .updateOne(
          { _id: doc._id },
          { $set: { [field]: value, datemodified: Date.now() } }
        )
        .then((result) => {
          resolve(
            result.modifiedCount > 0
              ? new RealmSlide({
                  ...doc,
                  [field]: value,
                  datemodified: Date.now(),
                })
              : doc
          );
        })
        .catch((error) => reject(error));
    });
  }

  static remove(user: User, _id: BSON.ObjectId) {
    return new Promise<boolean>(async (resolve, reject) => {
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .deleteOne({ _id })
        .then((result) => {
          resolve(result.deletedCount > 0);
        })
        .catch((error) => reject(error));
    });
  }

  static query(user: User): Promise<RealmSlide[]> {
    return new Promise(async (resolve, reject) => {
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .find({ type: "slideshow" })
        .then((res) => resolve(res.map((doc) => new RealmSlide(doc))))
        .catch((error) => reject(error));
    });
  }

  static get(user: User, id: string): Promise<RealmSlide> {
    return new Promise<RealmSlide>(async (resolve, reject) => {
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .findOne({
          type: "slideshow",
          _id: BSON.ObjectId.createFromHexString(id),
          user: user.uid,
        })
        .then((value) => resolve(new RealmSlide(value)))
        .catch((error) => reject(error));
    });
  }

  static save(user: User, id: string, data: SlideshowVal) {
    return new Promise<boolean>(async (resolve, reject) => {
      const u = await this.getUser(user);
      u.mongoClient(this.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .updateOne(
          { _id: BSON.ObjectId.createFromHexString(id) },
          { $set: { ...data, datemodified: Date.now() } }
        )
        .then((result) => {
          resolve(result.modifiedCount > 0);
        })
        .catch((error) => reject(error));
    });
  }
}
