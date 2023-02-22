import { User } from "firebase/auth";
import { ProfileValue } from "./profile";
import { RealmMain } from "./realm.main";

export class RealmProfile extends ProfileValue {
  static get(user: User) {
    return new Promise<RealmProfile>(async (resolve, reject) => {
      const u = await RealmMain.getUser(user);
      u.mongoClient(RealmMain.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .findOne({ type: "profile", user: user.uid })
        .then((res) => resolve(new RealmProfile({ ...user, ...res })))
        .catch((error) => reject(error));
    });
  }

  static save(user: User, profile: RealmProfile) {
    return new Promise<boolean>(async (resolve, reject) => {
      const u = await RealmMain.getUser(user);
      u.mongoClient(RealmMain.CLUSTER_NAME)
        .db("mek")
        .collection("documents")
        .updateOne(
          { type: "profile", user: user.uid },
          { $set: profile.val() },
          { upsert: true }
        )
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  static view(user: User, uid: string) {
    return new Promise<RealmProfile | null>(async (resolve, reject) => {
      const u = await RealmMain.getUser(user);
      u.functions
        .callFunction("profile__get", uid)
        .then((data) => {
          if (data) {
            resolve(new RealmProfile(data));
          } else {
            resolve(null);
          }
        })
        .catch(reject);
    });
  }

  static follow(user: User, uid: string, value: boolean) {
    return new Promise<RealmProfile | null>(async (resolve, reject) => {
      const u = await RealmMain.getUser(user);
      if (value) {
        await u
          .mongoClient(RealmMain.CLUSTER_NAME)
          .db("mek")
          .collection("documents")
          .updateOne(
            { type: "follow", user: user.uid, to: uid },
            { $set: { type: "follow", user: user.uid, to: uid, accept: true } },
            { upsert: true }
          );
      } else {
        await u
          .mongoClient(RealmMain.CLUSTER_NAME)
          .db("mek")
          .collection("documents")
          .deleteOne({ type: "follow", user: user.uid, to: uid });
      }
      resolve(await this.view(user, uid));
    });
  }

  static update(user: User, data: Record<string, any>) {
    return new Promise<boolean>(async (resolve, reject) => {
      const u = await RealmMain.getUser(user);
      u.mongoClient(RealmMain.CLUSTER_NAME)
        .db("journals")
        .collection("auths")
        .updateOne({ uid: user.uid }, { $set: data })
        .then(({ modifiedCount }) => {
          resolve(modifiedCount > 0);
        })
        .catch(reject);
    });
  }
}
