export class Email {
  private static replace(text: string) {
    return (text.slice(0, 3) + new Array(text.length + 1).join("x")).slice(
      0,
      text.length
    );
  }

  static censor(email: string) {
    if (this.validate(email)) {
      const [account, site] = email.split("@");
      const site_split = site.split(".");
      const censored = `
        ${this.replace(account)}@${this.replace(
        site_split.slice(0, -1).join(".")
      )}.${site_split.at(-1)}`;
      return censored;
    }
    return email
  }

  static validate(email?: string): boolean {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email || "").toLowerCase());
  }
}
