import { User } from "firebase/auth";
import { MainStatic } from "./main.static";

export interface FileDocument {
  _id: string;
  datecreate: string;
  datemodified: string;
  md5: string;
  mimetype: string;
  name: string;
  path: string;
  size: number;
  type: "file";
  user: string;
}

export class FileCtl extends MainStatic {
  static upload(user: User, file: File): Promise<FileDocument> {
    return new Promise(async (resolve, reject) => {
      var data = new FormData();
      data.append("file", file);

      fetch(`${this.baseUrl()}/file/upload/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((res: FileDocument) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  static downloadFromUrl(url: string, filename: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          resolve(true);
        })
        .catch(reject);
    });
  }
}
