import { DateMainCtlConstructor, MainCtl } from ".";
import { PickIconName } from "../PickIcon";
import { LocaleKey } from "../Translate/en_th";
import { Schedule } from "./course";

export class Material extends MainCtl {
  id: string;
  title: string;
  parent: string;
  point: number;
  sort: number;
  user: string;
  type: "lesson" | "assignment" | "quiz";
  schedule: Schedule;

  constructor(data?: Partial<Material & DateMainCtlConstructor>) {
    super(data);

    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.type = data?.type ?? "lesson";
    this.schedule = new Schedule(data?.schedule);
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.point = parseFloat(`${data?.point ?? 0}`);
    this.sort = data?.sort ?? 9999
  }

  set<T extends keyof this>(
    field: T,
    dispatch: (data: this[T]) => this[T]
  ): this {
    this[field] = dispatch(this[field]);
    return this;
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
      label: "Online Quiz",
      icon: "file-alt",
    },
    quiz: {
      label: "Quiz",
      icon: "list-ol",
    },
  };
}

export class MaterialQuiz extends Material {
  amount: number;
  attemps: number;
  quizId: string;

  constructor(data?: Partial<MaterialQuiz>) {
    super(data);

    this.amount = data?.amount ?? 0;
    this.attemps = data?.attemps ?? -1;
    this.quizId = data?.quizId ?? "";
  }

  setQuiz(data: Pick<this, "title" | "quizId" | "amount">): this {
    const { title, quizId, amount } = data;
    this.title = title;
    this.quizId = quizId;
    this.amount = amount;
    return this;
  }
}

export type MaterialAssignmentFileType = { name: string; url: string };
export class MaterialAssignment extends Material {
  content: string;
  datedue: string;
  files: MaterialAssignmentFileType[];
  rawFiles: File[];
  weight: number

  constructor(data?: Partial<MaterialAssignment>) {
    super(data);

    this.content = data?.content ?? "";
    this.datedue = data?.datedue ?? "";
    this.files = data?.files ?? [];
    this.rawFiles = data?.rawFiles ?? [];
    this.weight = data?.weight ?? 0
  }
}
