import { VisibilityTabsValue } from "../VisibilityTabs";
import { DateCtl } from "./date.ctl";
import { ImageCredit } from "./image";

//SECTION - RealmImage
export class RealmImage {
  id: string;
  blurhash: string;
  credit: null | ImageCredit;
  md5: string;
  url: string;
  datecreate: number;
  datemodified: number;
  from: string;
  fromId: string;
  meta: null | any;
  mimetype: string;
  name: string;
  originalname: string;
  size: number;
  user: string;

  large: string;
  medium: string;
  thumbnail: string;

  height: number;
  width: number;

  type: "image" | "s3image";

  rating: number;
  visibility: VisibilityTabsValue;

  //ANCHOR - constructor
  constructor(data?: Partial<RealmImage>) {
    this.id = data?.id ?? "";
    this.blurhash = data?.blurhash ?? "";
    this.credit = data?.credit ? new ImageCredit(data.credit) : null;
    this.md5 = data?.md5 ?? "";
    this.url = data?.url ?? "";
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.from = data?.from ?? "";
    this.fromId = data?.fromId ?? "";
    this.mimetype = data?.mimetype ?? "";
    this.name = data?.name ?? "";
    this.originalname = data?.originalname ?? "";
    this.size = data?.size ?? 0;
    this.user = data?.user ?? "";

    this.large = data?.large ?? "";
    this.medium = data?.medium ?? "";
    this.thumbnail = data?.thumbnail ?? "";

    this.height = data?.height ?? 0;
    this.width = data?.width ?? 0;

    this.type = data?.type ?? "image";

    this.rating = data?.rating ?? 0;
    this.visibility = data?.visibility ?? "private";

    this.meta = data?.meta ?? null;
  }

  update<T extends keyof this>(
    token: string,
    field: T,
    value: this[T] | ((data: this[T]) => this[T])
  ): RealmImage {
    RealmImage.getPrivate(token, "62bd7c145cb69738fb9166b1").then((data) => {
      console.log(data);
    });
    this[field] = value instanceof Function ? value(this[field]) : value;
    return new RealmImage(this);
  }

  getModel(): string | null {
    return this.meta?.exif?.image?.Model ?? null;
  }

  getFNumber(): string {
    return this.meta?.exif?.exif?.FNumber ?? null;
  }

  getISO(): string | null {
    return this.meta?.exif?.exif?.ISO ?? null;
  }

  getFocalLength(): string | null {
    return this.meta?.exif?.exif?.FocalLengthIn35mmFormat ?? null;
  }

  getLensModel(): string | null {
    return this.meta?.exif?.exif?.LensModel ?? null;
  }

  //SECTION - STATIC
  //ANCHOR - endpoint
  static endpoint: string = `https://ap-southeast-1.aws.data.mongodb-api.com/app/phrain-realm-wfzbv/endpoint`;

  //ANCHOR - getPrivate
  static async getPrivate(token: string, id: string): Promise<RealmImage> {
    const data = await fetch(
      `${this.endpoint}/image/get/private?id=${id}&token=${token}`
    ).then((res) => res.json());
    console.log(data);
    const image = new RealmImage(data);
    return image;
  }

  //ANCHOR - queryPrivate
  static queryPrivate(
    token: string,
    ids: string[]
  ): Promise<Record<string, RealmImage>> {
    return new Promise((resolve, reject) => {
      fetch(`${this.endpoint}/image/query/private?token=${token}`, {
        method: "POST",
        body: JSON.stringify({ ids, size: "medium" }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 0) {
            reject(new Error(res.message));
          } else {
            const data = Array.from(res.data)
              .map((doc: any) => new RealmImage(doc))
              .reduce(
                (data, doc) => Object.assign(data, { [doc.id]: doc }),
                {} as Record<string, RealmImage>
              );
            resolve(data);
          }
        });
    });
  }
  //!SECTION
}
//!SECTION
