import { User } from "firebase/auth";
import axios from "axios";
import { apiURL, DateCtl } from "../Controller";
import { MainStatic } from "./main.static";
import {
  addDoc,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  onSnapshot,
  Unsubscribe,
  updateDoc,
} from "firebase/firestore";
import { db, dbTimestamp } from "./firebase";
import { RealmImage } from "./realm.image";

export interface StockImageTypes {
  __v: string;
  _id: string;
  datecreate: string;
  datemodified: string;
  visibility: "public" | "private";
  type: "image";
  user: string;
  md5: string;
  originalname: string;
  size: number;
  mimetype: string;
  name: string;
  path: string;
  height?: number;
  width?: number;
  blurhash: string;
  medium?: string;
  thumbnail?: string;
  from?: string;
  fromId?: string;
  credit?: {
    type: string;
    value: string;
    uid: string;
  };
  ref?: string;
}

export interface StockImageOptionsTypes {
  _id?: string;
  datecreate?: string;
  datemodified?: string;
  visibility?: "public" | "private";
  type?: "image";
  user?: string;
  md5?: string;
  originalname?: string;
  size?: number;
  mimetype?: string;
  name?: string;
  path?: string;
  height?: number;
  width?: number;
  blurhash?: string;
  medium?: string;
  thumbnail?: string;
  from?: string;
  fromId?: string;
  credit?: {
    type: string;
    value: string;
    uid: string;
  };
  ref?: string;
}

export type StockImageCompactDocument = {
  _id: string;
  id: string;
  name: string;
  width: number;
  height: number;
  blurhash: string;
  type: "image";
  datecreate: number;
  datemodified: number;
  visibility: "private" | "public";
  thumbnail: string;
};

export class StockImageController extends MainStatic {
  user: User;
  apiURL: string = apiURL;

  constructor(user: User) {
    super();
    this.user = user;
  }

  async getHeader(user: User, opts?: HeadersInit): Promise<HeadersInit> {
    const token = await user.getIdToken();
    return Object.assign({}, opts, {
      Authorization: `Bearer ${token}`,
    } as HeadersInit);
  }

  async getMy(): Promise<StockImageTypes[]> {
    if (this.user) {
      const result = await fetch(`${this.apiURL}/file/my`, {
        method: "GET",
        headers: await this.getHeader(this.user),
      })
        .then<StockImageTypes[]>((res) => res.json())
        .catch((err) => {
          throw new Error(err.message);
        });
      return result;
    } else {
      return [];
    }
  }

  /**
   * =============================================
   *   ____   _          _    _
   *  / ___| | |_  __ _ | |_ (_)  ___
   *  \___ \ | __|/ _` || __|| | / __|
   *   ___) || |_| (_| || |_ | || (__
   *  |____/  \__|\__,_| \__||_| \___|
   *
   * =============================================
   */

  static async query(
    user: User,
    query: Record<string, unknown>
  ): Promise<StockImageCompactDocument[]> {
    const docs = await this.get<StockImageCompactDocument[]>(
      user,
      `${this.baseUrl()}/image/v2/query`,
      "POST",
      JSON.stringify({ query })
    ).catch((err) => {
      throw err;
    });
    return docs;
  }

  static async getMy(user: User): Promise<StockImageCompactDocument[]> {
    return await this.query(user, {
      type: { $in: ["s3image", "image"], parent: undefined },
    }).catch((error) => {
      throw error;
    });
  }

  getPublic = async (page: number = 1): Promise<StockImageTypes[]> => {
    if (this.user) {
      const result = await fetch(`${this.apiURL}/file/public/${page}`, {
        headers: await this.getHeader(this.user),
      }).then((res) => res.json());
      return result;
    }
    return [];
  };

  upload = async (
    file: File,
    onUploadProgress?: (progress: number) => void
  ): Promise<StockImageTypes> => {
    if (this.user) {
      const token = await this.user.getIdToken();
      const data = new FormData();
      data.append("file", file);
      const result = await axios.put<StockImageTypes>(
        `${this.apiURL}/file/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progress: ProgressEvent) => {
            const percent = progress.loaded / progress.total;
            onUploadProgress?.(Math.round(percent * 10000) / 100);
          },
        }
      );
      return result.data;
    } else {
      throw new Error("please sign in");
    }
  };

  update = async (
    _id: string,
    data: StockImageOptionsTypes
  ): Promise<StockImageTypes | null> => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/`, {
        method: "PATCH",
        headers: await this.getHeader(this.user, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ _id, content: data }),
      }).then((res) => res.json());
      return res;
    }
    return null;
  };

  remove = async (_id: string) => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/id/${_id}`, {
        method: "DELETE",
        headers: await this.getHeader(this.user),
      }).then((res) => res.json());
      return res;
    }
  };

  keep = async (_id: string): Promise<StockImageTypes | null> => {
    if (this.user) {
      const res = await fetch(`${this.apiURL}/file/keep/${_id}`, {
        method: "PUT",
        headers: await this.getHeader(this.user),
      }).then(
        (res) => res.json(),
        (err) => console.log(err)
      );
      return res;
    }
    return null;
  };

  getTag = () => {
    return [];
  };

  private toDataURL(url: string): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(() => reject(new Error("Fail to load image from URL")));
    });
  }

  private dataURLtoFile(
    dataurl: string,
    onRejected?: (err: Error) => void
  ): File | null {
    var arr = dataurl.split(","),
      mime = arr[0]?.match(/:(.*?);/)?.[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    if (mime && /image/.test(mime)) {
      const filename =
        Date.now().toString() + "." + mime.split("/")[1].toLowerCase();
      return new File([u8arr], filename, { type: mime });
    } else {
      onRejected?.(new Error("Invalid type"));
      return null;
    }
  }

  fromURL = (url: string): Promise<File | null> => {
    return new Promise(async (resolved, reject) => {
      const buffer = await this.toDataURL(url).catch((err) => {
        reject(err);
      });
      if (typeof buffer === "string") {
        const file = this.dataURLtoFile(buffer, (err) => {
          reject(err);
        });
        resolved(file);
      } else {
        reject(new Error("invalid URL"));
      }
    });
  };
}

//SECTION - ImageAlbum
export class ImageAlbum extends MainStatic {
  id: string;
  title: string;
  images: string[];
  imagesData: RealmImage[];
  datecreate: number;
  datemodified: number;
  feature?: string;
  private user: User;

  //ANCHOR - constructor
  constructor(user: User, data?: Partial<ImageAlbum>) {
    super();
    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.images = data?.images ?? [];
    this.imagesData = data?.imagesData ?? [];
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.feature = data?.feature ?? "";
    this.user = user;
  }

  //ANCHOR - update
  async update<Key extends keyof ImageAlbum>(
    field: Key,
    value: ImageAlbum[Key]
  ): Promise<void> {
    await updateDoc(ImageAlbum.doc(this.user, "albums", this.id), {
      [field]: value,
      datemodified: dbTimestamp(),
    });
  }

  //ANCHOR - append
  async append(images: string[]) {
    await updateDoc(ImageAlbum.doc(this.user, "albums", this.id), {
      datemodified: dbTimestamp(),
      images: arrayUnion(...images),
    });
  }

  //ANCHOR - remove
  async remove(): Promise<void> {
    await deleteDoc(ImageAlbum.doc(this.user, "albums", this.id));
  }

  //SECTION - STATIC
  //ANCHOR - doc
  static doc(
    user: User,
    path: string,
    ...pathSegments: string[]
  ): DocumentReference<DocumentData> {
    return doc(db, "users", user.uid, path, ...pathSegments);
  }

  //ANCHOR - collection
  static collection(
    user: User,
    path: string,
    ...pathSegments: string[]
  ): CollectionReference<DocumentData> {
    return collection(db, "users", user.uid, path, ...pathSegments);
  }

  //ANCHOR - watchAlbum
  static watchAlbum(
    user: User,
    callback: (docs: ImageAlbum[]) => void
  ): Unsubscribe {
    return onSnapshot(this.collection(user, "albums"), async (snapshot) => {
      const token = await user.getIdToken();
      const docs = snapshot.docs
        .map((doc) => this.parseDoc<any>(doc))
        .map((doc): ImageAlbum => {
          let feature: undefined | string = undefined;
          if (doc.feature) {
            feature = StockImage.private(doc.feature, token);
          } else if ((doc.images.length ?? 0) > 0) {
            feature = StockImage.private(doc.images[0], token);
          }
          return new ImageAlbum(user, {
            ...doc,
            feature,
            user,
          });
        });

      const ids = docs
        .reduce((images, doc) => images.concat(doc.images), [] as string[])
        .filter((id, index, ids) => ids.indexOf(id) === index);

      const images = await RealmImage.queryPrivate(
        await user.getIdToken(),
        ids
      );

      callback(
        docs.map(
          (doc) =>
            new ImageAlbum(user, {
              ...doc,
              imagesData: doc.images.map((id) => images[id]),
            })
        )
      );
    });
  }

  //ANCHOR - add
  static async add(user: User, title: string, images?: string[]) {
    await addDoc(this.collection(user, "albums"), {
      title,
      datecreate: dbTimestamp(),
      datemodified: dbTimestamp(),
      images: images || [],
    });
  }
  //!SECTION
}
//!SECTION

export class StockImage extends MainStatic {
  _id?: string;
  id?: string;
  blurhash: string;
  datecreate: number;
  datemodified: number;
  height: number;
  width: number;
  name: string;
  thumbnail: string;
  type: "image" = "image";
  visibility: "private" | "public" | "trash";

  constructor(
    data: {
      [K in keyof Omit<
        StockImage,
        "id" | "_id" | "datecreate" | "datemodified"
      >]: StockImage[K];
    } & {
      [K in keyof Pick<
        StockImage,
        "id" | "_id" | "datecreate" | "datemodified"
      >]?: StockImage[K];
    }
  ) {
    super();

    this._id = data._id || data.id;
    this.id = data.id || data._id;
    this.blurhash = data.blurhash;
    this.datecreate = data.datecreate || Date.now();
    this.datemodified = data.datemodified || Date.now();
    this.height = data.height;
    this.width = data.width;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.visibility = data.visibility;
  }

  /**
   * =============================================
   *   ____   _          _    _
   *  / ___| | |_  __ _ | |_ (_)  ___
   *  \___ \ | __|/ _` || __|| | / __|
   *   ___) || |_| (_| || |_ | || (__
   *  |____/  \__|\__,_| \__||_| \___|
   *
   * =============================================
   */
  static private(id: string, token: string): string {
    return `${this.baseUrl()}/image/view/private/${id}/${token}`;
  }
  private static async find(
    user: User,
    query: Record<string, unknown>
  ): Promise<Array<StockImage>> {
    const docs = await this.get<Array<StockImage>>(
      user,
      `${this.baseUrl()}/image/v2/query`,
      "POST",
      JSON.stringify({ query })
    );
    return docs.map((doc) => new StockImage(doc));
  }
  static async findOne(user: User, id: string): Promise<StockImage | null> {
    if (user && id) {
      const docs = await this.find(user, { _id: id });
      return docs.length ? docs[0] : null;
    } else if (!user) {
      throw new Error("Unauthorize Account");
    } else {
      throw new Error("ID not found");
    }
  }
  static display(id: string, token?: string) {
    return token
      ? `https://nest.phra.in/image/view/private/${id}/${token}/medium`
      : "";
  }
}

//SECTION - ImageCredit
export class ImageCredit {
  type: "credit";
  value: string | null;
  picture: string | null;
  user: string;

  constructor(data?: Partial<ImageCredit>) {
    this.type = data?.type ?? "credit";
    this.value = data?.value ?? null;
    this.picture = data?.picture ?? null;
    this.user = data?.user ?? "";
  }

  //SECTION - STATIC
  //ANCHOR - endpoint
  private static readonly endpoint: string =
    "https://ap-southeast-1.aws.data.mongodb-api.com/app/phrain-realm-wfzbv/endpoint";
  static get(id: string): Promise<ImageCredit> {
    return new Promise((resolve, reject) => {
      fetch(`${this.endpoint}/image/credit?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            reject(new Error(data.error));
          } else {
            resolve(new ImageCredit(data));
          }
        });
    });
  }
  //!SECTION
}
//!SECTION
