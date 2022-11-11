import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { DateMainCtlConstructor, MainCtl, MainStatic } from ".";
import { cleanObject } from "../func";
import { PickIconName } from "../PickIcon";
import { LocaleKey } from "../Translate/en_th";
import { Lesson, Schedule } from "./course";
import { db } from "./firebase";
import { ExcludeMethods } from "./map";
import { FileCtl, FileDocument } from "./files.static";
import { User } from "firebase/auth";

export type MaterialFileType = { name: string; url: string };
export class Material extends MainCtl {
  id: string;
  title: string;
  parent: string;
  point: number;
  sort: number;
  user: string;
  type: "lesson" | "assignment" | "quiz";
  schedule: Schedule;

  // Quiz
  amount: number;
  attemps: number;
  quizId: string;

  // Assignment
  content: string;
  datedue: string;
  files: MaterialFileType[];
  rawFiles: File[];

  weight: number;

  constructor(data?: Partial<Material & DateMainCtlConstructor>) {
    super(data);

    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.type = data?.type ?? "lesson";
    this.schedule = new Schedule(data?.schedule);
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.point = parseFloat(`${data?.point ?? 0}`);
    this.sort = data?.sort ?? 9999;
    this.content = data?.content ?? "";
    this.datedue = data?.datedue ?? "";
    this.files = data?.files ?? [];
    this.rawFiles = data?.rawFiles ?? [];
    this.weight = data?.weight ?? 0;
    this.amount = data?.amount ?? 0;
    this.attemps = data?.attemps ?? -1;
    this.quizId = data?.quizId ?? "";
  }

  set<T extends keyof this>(
    field: T,
    dispatch: (data: this[T]) => this[T]
  ): this {
    this[field] = dispatch(this[field]);
    return this;
  }

  setQuiz(data: Pick<this, "title" | "quizId" | "amount">): this {
    const { title, quizId, amount } = data;
    this.title = title;
    this.quizId = quizId;
    this.amount = amount;
    return this;
  }

  isComplete(type: Material["type"]): boolean {
    switch (type) {
      case "quiz":
        return Boolean(this.quizId && this.title);
      case "assignment":
        return Boolean(this.title && this.content && this.datedue);
      default:
        return false;
    }
  }

  async remove(): Promise<void> {
    if (this.id) {
      await deleteDoc(Material.doc(this.id));
    }
  }

  toJSON(): Omit<
    Material,
    | "datecreate"
    | "datemodified"
    | "id"
    | "save"
    | "setQuiz"
    | "toJSON"
    | "set"
    | "stockToDisplay"
    | "schedule"
    | "isComplete"
    | "remove"
    | "rawFiles"
  > & { schedule: ExcludeMethods<Schedule> } {
    const {
      datecreate,
      datemodified,
      id,
      save,
      setQuiz,
      toJSON,
      set,
      stockToDisplay,
      schedule,
      isComplete,
      remove,
      rawFiles,
      ...data
    } = this;
    return { ...data, schedule: schedule.toJSON() };
  }

  async save(user: User): Promise<void> {
    if (!this.parent) throw new Error("Parent not found");
    if (!this.user) throw new Error("User ID not found");

    if (this.isComplete(this.type)) {
      let addedFiles = (
        await Promise.all(
          this.rawFiles.map(async (file) => await FileCtl.upload(user, file))
        )
      )
        .filter((file): file is FileDocument => Boolean(file))
        .map((file) => ({
          name: file!.name,
          url: `${MainStatic.baseUrl()}/file/${file!._id}`,
        }));

      const data = this.toJSON();

      if (this.id) {
        await updateDoc(Material.doc(this.id), {
          ...cleanObject(data),
          files: data.files.concat(...addedFiles),
          datemodified: serverTimestamp(),
        });
      } else {
        await addDoc(Material.collection(), {
          ...cleanObject(data),
          files: data.files.concat(...addedFiles),
          datecreate: serverTimestamp(),
          datemodified: serverTimestamp(),
          sort: await Lesson.getLastSort(this.parent),
        });
      }
    } else {
      throw new Error("Data not complete");
    }
  }

  protected static collection(): CollectionReference<DocumentData> {
    return collection(db, "lms", this.prefix, "courses");
  }
  protected static doc(id: string): DocumentReference<DocumentData> {
    return doc(db, "lms", this.prefix, "courses", id);
  }

  static lists: Record<
    Material["type"],
    { label: LocaleKey; icon: PickIconName }
  > = {
    lesson: {
      label: "Lesson",
      icon: "chalkboard",
    },
    assignment: {
      label: "Assignment",
      icon: "file-alt",
    },
    quiz: {
      label: "Quiz",
      icon: "list-ol",
    },
  };
}
