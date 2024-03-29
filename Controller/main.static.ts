import { User } from "firebase/auth";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { VisibilityValue } from "../Visibility";

export type BaseUrlOptions = {
  local?: boolean;
};
export class MainStatic {
  static prefix?: string = process.env.REACT_APP_PREFIX;
  static apiURL: string = "https://s1.phra.in:8086";
  static baseUrl(options?: BaseUrlOptions): string {
    return options?.local ? "http://localhost:8080" : "https://nest.phra.in";
  }

  protected static token = async (user: User) =>
    await user.getIdToken().catch((reason) => {
      throw new Error(reason.message);
    });

  protected static async get<T extends unknown>(
    user: User,
    input: RequestInfo,
    method: string,
    body?: FormData | string
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      fetch(input, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await this.token(user)}`,
        },
        body,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res?.error) {
            reject(res);
          } else {
            resolve(res as T);
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  protected static parseDoc<T extends unknown>(
    doc: QueryDocumentSnapshot<DocumentData>
  ): T {
    return { ...doc.data(), id: doc.id } as T;
  }

  static imageSrcFromId(
    imageId: string,
    size: "" | "thumbnail" | "medium" | "large" = ""
  ) {
    if (imageId) {
      console.log(imageId)
      return `${this.apiURL}/file/id/${imageId}/${size}`;
    }
    return undefined;
  }

  static docsFilter<T extends { visibility: VisibilityValue }>(
    docs: T[],
    visibility: VisibilityValue
  ): T[] {
    const filtered = docs.filter((doc) => doc.visibility === visibility);
    return filtered;
  }
}
