import {
  addDoc,
  deleteDoc,
  collection,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
  Unsubscribe,
  getDoc,
  orderBy,
  FirestoreError,
  runTransaction,
} from "firebase/firestore";
import { User } from "firebase/auth";
import moment from "moment";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { db } from "./firebase";
import { cleanObject } from "../func";
import { FileDocument } from "./files.static";
import { MainStatic } from "./main.static";

//ANCHOR - NestFile Type
export type NestFile = {
  _id: string;
  ext: string;
  mime: string;
  name: string;
  size: number;
  user: string;
  downloadURL: string;
};

//ANCHOR - FileParentList
export type FileParentList = Record<"title" | "keyId", string>;

//ANCHOR - TYPE: MekDataType
export type MekDateType = Timestamp | Date | number;

//SECTION - CLASS: MekFile
export class MekFile {
  id: string;
  content?: NestFile;
  folder?: { title?: string };
  user?: string;
  parent: string;
  star: boolean;
  type: "folder" | "file";
  datecreate?: number;
  datemodified?: number;
  visibility?: VisibilityTabsValue;

  constructor(data?: Partial<MekFile>) {
    this.id = data?.id ?? "";
    this.content = data?.content;
    this.folder = data?.folder;
    this.user = data?.user;
    this.parent = data?.parent ?? "";
    this.star = data?.star ?? false;
    this.type = data?.type ?? "file";
    this.datecreate = this.parseDate(data?.datecreate);
    this.datemodified = this.parseDate(data?.datemodified);
    this.visibility = data?.visibility ?? "private";
  }

  //ANCHOR - parseDate
  private parseDate(date?: MekDateType): number {
    if (date instanceof Date) {
      return date.getTime();
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else if (typeof date === "number") {
      return date;
    } else {
      return Date.now();
    }
  }

  //ANCHOR - getTitle
  getTitle(): string {
    if (this.type === "folder") {
      return this.folder?.title ?? "";
    } else if (this.type === "file") {
      return this.content?.name ?? "";
    } else {
      return "";
    }
  }

  //ANCHOR - getSize
  getSize(): string {
    if (this.type === "folder") {
      return "-";
    } else if (this.type === "file" && this.content?.size) {
      return MekFile.fileSize(this.content.size);
    } else {
      return "";
    }
  }

  //ANCHOR - toJSON
  toJSON(): MekFile {
    return Object.assign(
      {},
      ...Object.entries(this)
        .filter(([_key, value]) => typeof value !== "function")
        .map(([key, value]) => ({ [key]: value }))
    );
  }

  //ANCHOR - update
  async update<Key extends keyof this>(
    field: Key,
    value: this[Key]
  ): Promise<void> {
    if (this.user && this.id) {
      await updateDoc(MekFile.doc(this.user, this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  //ANCHOR - updateContent
  async updateContent<Key extends keyof NestFile>(
    field: Key,
    value: NestFile[Key]
  ): Promise<void> {
    if (this.user && this.id) {
      const ref = MekFile.doc(this.user, this.id);
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(ref);
        if (doc.exists()) {
          if (doc.data().content) {
            await transaction.update(ref, {
              [`content.${field}`]: value,
              datemodified: serverTimestamp(),
            });
          } else {
            await transaction.update(ref, {
              content: {
                [field]: value,
              },
              datemodified: serverTimestamp(),
            });
          }
        }
      });
    }
  }

  //ANCHOR - remove
  async remove(): Promise<void> {
    if (this.user && this.id) {
      await deleteDoc(MekFile.doc(this.user, this.id));
    }
  }

  //ANCHOR - save
  async save(user: User): Promise<void> {
    if (this.id) {
      await updateDoc(MekFile.doc(user.uid, this.id), {
        ...cleanObject(this.toJSON()),
        datemodified: serverTimestamp(),
      });
    } else {
      const doc = await addDoc(MekFile.collection(user.uid), {
        ...cleanObject(this.toJSON()),
        user: user.uid,
        datecreate: serverTimestamp(),
        datemodified: serverTimestamp(),
      });
      this.id = doc.id;
    }
  }

  //SECTION - static

  //ANCHOR - doc
  private static doc(uid: string, id: string) {
    return doc(db, "users", uid, "docs", id);
  }

  //ANCHOR - collection
  private static collection(uid: string) {
    return collection(db, "users", uid, "docs");
  }

  //ANCHOR - watch
  static watch(
    user: User,
    callback: (docs: MekFile[]) => void,
    parent: string = "0"
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(user.uid),
        where("type", "in", ["file", "folder"]),
        where("parent", "==", parent)
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new MekFile({ ...doc.data(), id: doc.id })
        );
        callback(docs);
      }
    );
  }

  //ANCHOR - addFolder
  static async addFolder(
    user: User,
    title: string,
    parent?: string
  ): Promise<MekFile> {
    const newFile = new MekFile({
      type: "folder",
      folder: { title },
      user: user.uid,
      parent: parent || "0",
    });
    await newFile.save(user);
    return newFile;
  }

  //ANCHOR - addFile
  static async addFile(
    user: User,
    file: FileDocument,
    parent: string = "0"
  ): Promise<MekFile> {
    const { _id, mimetype, name, size } = file;
    const newFile = new MekFile({
      type: "file",
      content: {
        _id,
        ext: name.split(".").slice(-1)[0],
        mime: mimetype,
        name,
        size,
        user: user.uid,
        downloadURL: `${MainStatic.baseUrl()}/file/id/${_id}`,
      },
      user: user.uid,
      parent,
    });
    await newFile.save(user);
    return newFile;
  }

  //ANCHOR - displayDate
  static displayDate(date: number): string {
    return moment(date).format("YYYY/MM/DD HH:mm");
  }

  //ANCHOR - fileSize
  static fileSize(size: number): string {
    size = size / 1000;
    if (size > 1000) {
      return `${size / 1000} MB`;
    } else {
      return `${size} KB`;
    }
  }

  //ANCHOR - getParent
  static async getParent(user: User, id: string): Promise<FileParentList[]> {
    if (id && user) {
      const doc = (await getDoc(this.doc(user.uid, id))).data() as MekFile;
      if (doc?.folder?.title) {
        let parentId = doc.parent;
        let folderRoot: Record<"title" | "keyId", string> = {
          title: doc.folder.title,
          keyId: id,
        };
        const parentRoot = await this.getParent(user, parentId);
        return [folderRoot].concat(...parentRoot);
      }
    }
    return [];
  }

  //ANCHOR - watchFolder
  static watchFolder(
    user: User,
    callback: (docs: MekFile[]) => void,
    onError?: (error: FirestoreError) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(user.uid),
        where("type", "==", "folder"),
        where("visibility", "in", ["private", "public"]),
        orderBy("datecreate", "desc")
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new MekFile({ ...doc.data(), id: doc.id })
        );
        callback(docs);
      },
      (error) => onError?.(error)
    );
  }

  //ANCHOR - watchMany
  static watchMany(
    user: User,
    callback: (docs: MekFile[], parent: FileParentList[]) => void,
    parent: string = "0"
  ) {
    return onSnapshot(
      query(
        this.collection(user.uid),
        where("type", "in", ["file", "folder"]),
        where("parent", "==", parent)
      ),
      async (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new MekFile({ ...doc.data(), id: doc.id })
        );
        const list = await this.getParent(user, parent);
        callback(docs, list);
      }
    );
  }

  //!SECTION
}
//!SECTION
