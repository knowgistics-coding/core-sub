export type ReportList =
  | "Nudity"
  | "Violence"
  | "Harassment"
  | "Suicide or self-injury"
  | "False Infomation"
  | "Spam"
  | "Unauthorized sales"
  | "Hate speech"
  | "Terrorism"
  | "Something Else";
export type ReportJSON = Pick<Report, "paths" | "selection" | "explaination">;

export class Report {
  paths: string[];
  selection: ReportList[];
  explaination: string;

  constructor(data: ReportJSON) {
    this.paths = data.paths;
    this.selection = data.selection;
    this.explaination = data.explaination;
  }

  set<T extends keyof ReportJSON>(
    field: T,
    func: (value: this[T]) => this[T]
  ): this {
    this[field] = func(this[field]);
    return this;
  }

  toJSON(): ReportJSON {
    const { paths, selection, explaination } = this;
    return { paths, selection, explaination };
  }

  isComplete(): boolean {
    if (
      this.selection.includes("Something Else") &&
      this.explaination.length < 1
    ) {
      return false;
    }
    return this.paths.length > 1 && this.selection.length > 0;
  }

  static list: ReportList[] = [
    "Nudity",
    "Violence",
    "Harassment",
    "Suicide or self-injury",
    "False Infomation",
    "Spam",
    "Unauthorized sales",
    "Hate speech",
    "Terrorism",
    "Something Else",
  ];

  static reducer<T extends keyof ReportJSON>(
    state: Report,
    action: {
      type: T;
      value?: ReportJSON[T];
      checked?: boolean;
      select?: ReportList;
    }
  ): Report {
    switch (action.type) {
      case "paths":
        return new Report(
          state.set("paths", (paths) =>
            Array.isArray(action.value) ? action.value : paths
          )
        );
      case "selection":
        return action.select
          ? new Report(
              state.set("selection", (sl) =>
                action.checked
                  ? sl.concat(action.select!).slice(0, 3)
                  : sl.filter((s) => s !== action.select)
              )
            )
          : state;
      case "explaination":
        return new Report(
          state.set("explaination", (explaination) =>
            typeof action.value === "string" ? action.value : explaination
          )
        );
      default:
        return state;
    }
  }
}
