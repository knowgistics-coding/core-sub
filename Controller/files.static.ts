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

export type ExcelData = {
  mimetype: string;
  data: { name: string; data: ExcelRowData[] }[];
};
export type ExcelRowData = (string | number)[];

export class FileCtl extends MainStatic {
  static browse(accept?: string, multiple?: boolean): Promise<File[]> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = Boolean(multiple);
      input.accept = accept || ".doc,.docx,.xls,.xlsx,.pdf,.txt,image/*";
      input.addEventListener("change", () => {
        input.removeEventListener("change", () => {});
        resolve(Array.from(input.files || []));
      });
      input.dispatchEvent(new MouseEvent("click"));
    });
  }
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
  static createDownloadFile(text: string, isCsv: boolean = false): string {
    const data = new Blob(isCsv ? ["\ufeff", text] : [text], {
      type: "text/plain;charset=utf8",
    });
    const url = window.URL.createObjectURL(data);
    return url;
  }
  static async fileReader(file: File): Promise<ExcelData> {
    return new Promise((resolve, reject) => {
      var data = new FormData();
      data.append("file", file);

      fetch(`${this.baseUrl()}/file/reader/`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res: any) => {
          if (res.error) {
            reject(new Error(res.message));
          } else {
            resolve(res as ExcelData);
          }
        })
        .catch((err) => reject(err));
    });
  }
}
