import { User } from "firebase/auth";

export type Document = {
  _id: string;
  datecreate: Date;
  datemodified: Date;
};
export type Options = {
  local?: boolean;
};

export const apiURL = "https://s1.phra.in:8086";
export class SkeMongo {
  readonly baseUrl: string = this.options?.local
    ? "http://localhost:8080"
    : "https://clownfish-app-rgti2.ondigitalocean.app";

  constructor(protected user: User, protected options?: Options) {}

  protected token = async () =>
    await this.user.getIdToken().catch((reason) => {
      throw new Error(reason.message);
    });

  protected async get<T extends unknown>(
    input: RequestInfo,
    method: string,
    body?: string
  ): Promise<T> {
    return (await fetch(input, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await this.token()}`,
      },
      body,
    })
      .then((res) => res.json())
      .catch((reason) => {
        throw new Error(reason.message);
      })) as T;
  }
}
