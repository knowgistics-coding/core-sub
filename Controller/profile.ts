import { StockDisplayProps } from "../StockDisplay";
import { ExcludeMethods } from "./map";
import { PageDoc } from "./page";

//SECTION - Follow
export class Follow {
  accept: boolean;
  displayName: string | null;
  photoURL: string | null;
  to: string;
  user: string;
  type: "follow";
  isFollow: boolean;

  //ANCHOR - constructor
  constructor(data?: Partial<Follow>) {
    this.accept = data?.accept ?? false;
    this.displayName = data?.displayName ?? null;
    this.photoURL = data?.photoURL ?? null;
    this.to = data?.to ?? "";
    this.user = data?.user ?? "";
    this.type = data?.type ?? "follow";
    this.isFollow = data?.isFollow ?? false;
  }
}
//!SECTION

//SECTION - ProfileValue
export type ProfileValueVal = ExcludeMethods<ProfileValue>;
export class ProfileValue {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;

  achievements: Record<"label" | "icon" | "from", string>[];
  feature: StockDisplayProps | null;
  contents: string;

  followers: Follow[];
  following: Follow[];

  //ANCHOR - constructor
  constructor(data?: Partial<ProfileValue>) {
    this.uid = data?.uid ?? "";
    this.displayName = data?.displayName ?? "";
    this.email = data?.email ?? "";
    this.emailVerified = data?.emailVerified ?? false;
    this.photoURL = data?.photoURL ?? null;

    this.achievements = data?.achievements ?? [];

    this.feature = data?.feature ?? null;
    this.contents = data?.contents ?? "[]";

    this.followers = (data?.followers ?? []).map((doc) => new Follow(doc));
    this.following = (data?.following ?? []).map((doc) => new Follow(doc));
  }

  //ANCHOR - getContents
  getContents(): PageDoc {
    try {
      const contents = JSON.parse(this.contents);
      return new PageDoc({
        contents: Array.isArray(contents) ? contents : [],
        feature: this.feature,
      });
    } catch (error) {
      return new PageDoc();
    }
  }

  //ANCHOR - setField
  setField<T extends keyof this>(field: T, value: this[T]): ProfileValue {
    this[field] = value;
    return new ProfileValue(this);
  }

  //ANCHOR - val
  val(): ProfileValueVal {
    return Object.entries(this)
      .filter(([, value]) => value instanceof Function === false)
      .reduce<ProfileValueVal>(
        (data, [key, value]) => Object.assign(data, { [key]: value }),
        {} as ProfileValueVal
      );
  }
}
//!SECTION
