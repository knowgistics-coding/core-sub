import { User } from "firebase/auth";

export class SkeMongo {
  readonly baseUrl: string = this.local
    ? "http://localhost:8080"
    : "https://clownfish-app-rgti2.ondigitalocean.app";

  constructor(protected user: User, protected local?: boolean) {}

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
        throw new Error(reason.messa);
      })) as T;
  }
}
