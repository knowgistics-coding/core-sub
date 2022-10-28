export type BaseUrlOptions = {
  local?: boolean;
};

export class PhrainNest {
  static baseUrl(options?: BaseUrlOptions): string {
    return options?.local ? "http://localhost:8080" : "https://nest.phra.in";
  }

  static imageSrcFromId(
    id?: string | null,
    token?: string | null
  ): string | undefined {
    return Boolean(id && token)
      ? `${this.baseUrl()}/image/view/private/${id}/${token}`
      : undefined;
  }
}
