import { TFunction } from "../context";
import { PickIconName } from "../PickIcon";

export type PopupReducerAction =
  | {
      type: "create";
      name: string;
      onConfirm: PopupReducer["onConfirm"];
      onAbort?: PopupReducer["onAbort"];
    }
  | {
      type: "ready-edit";
      name: string;
      onConfirm: PopupReducer["onConfirm"];
      onAbort?: PopupReducer["onAbort"];
    }
  | {
      type: "remove";
      name: string;
      onConfirm: PopupReducer["onConfirm"];
      onAbort?: PopupReducer["onAbort"];
    }
  | {
      type: "remove-trash";
      name: string;
      onConfirm: PopupReducer["onConfirm"];
      onAbort?: PopupReducer["onAbort"];
    }
  | { type: "value"; value: string }
  | {
      type: "set";
      alerttype: PopupReducer["type"]
      value:
        | Partial<PopupReducer>
        | ((data: PopupReducer) => Partial<PopupReducer>);
    }
  | { type: "open"; value: boolean };
export class PopupReducer {
  readonly timeout: number = 250;
  open: boolean;
  t: TFunction;
  title: string;
  text: string;
  icon: PickIconName;
  type: "alert" | "confirm" | "prompt" | "remove";
  onConfirm: (value?: string) => void;
  onAbort: () => void;
  value: string;

  constructor(t: TFunction, data?: Partial<PopupReducer>) {
    this.t = t;
    this.title = data?.title ?? "";
    this.text = data?.text ?? "";
    this.icon = data?.icon ?? "question-circle";
    this.onConfirm = data?.onConfirm ?? (() => {});
    this.onAbort = data?.onAbort ?? (() => {});
    this.type = data?.type ?? "alert";
    this.value = data?.value ?? "";
    this.open = data?.open ?? false;
  }

  set<T extends keyof this>(field: T, value: this[T]): PopupReducer {
    this[field] = value;
    return new PopupReducer(this.t, this);
  }

  create(
    name: string,
    onConfirm: PopupReducer["onConfirm"],
    onAbort?: PopupReducer["onAbort"]
  ) {
    this.open = true;
    this.title = this.t("Create $Name", { name });
    this.text = this.t("Title");
    this.icon = "plus-circle";
    this.onConfirm = onConfirm;
    this.onAbort = onAbort ?? (() => {});
    this.type = "prompt";
    return new PopupReducer(this.t, this);
  }

  readyEdit(
    name: string,
    onConfirm: PopupReducer["onConfirm"],
    onAbort?: PopupReducer["onAbort"]
  ) {
    this.open = true;
    this.title = this.t("Created");
    this.text = this.t("Ready To Edit", { name });
    this.icon = "check-circle";
    this.onConfirm = onConfirm;
    this.onAbort = onAbort ?? (() => {});
    this.type = "confirm";
    return new PopupReducer(this.t, this);
  }

  remove(
    name: string,
    onConfirm: PopupReducer["onConfirm"],
    onAbort?: PopupReducer["onAbort"]
  ): PopupReducer {
    this.open = true;
    this.title = this.t("Remove");
    this.text = this.t("Do You Want To Remove $Name", { name });
    this.icon = "trash";
    this.onConfirm = onConfirm;
    this.onAbort = onAbort ?? (() => {});
    this.type = "remove";
    return new PopupReducer(this.t, this);
  }

  removeTrash(
    name: string,
    onConfirm: PopupReducer["onConfirm"],
    onAbort?: PopupReducer["onAbort"]
  ): PopupReducer {
    this.open = true;
    this.title = this.t("Remove");
    this.text = this.t("Do You Want To Remove $Name Forever", { name });
    this.icon = "trash";
    this.onConfirm = onConfirm;
    this.onAbort = onAbort ?? (() => {});
    this.type = "remove";
    return new PopupReducer(this.t, this);
  }

  static reducer(
    state: PopupReducer,
    action: PopupReducerAction
  ): PopupReducer {
    switch (action.type) {
      case "create":
        return state.create(action.name, action.onConfirm, action.onAbort);
      case "ready-edit":
        return state.readyEdit(action.name, action.onConfirm, action.onAbort);
      case "remove":
        return state.remove(action.name, action.onConfirm, action.onAbort);
      case "remove-trash":
        return state.removeTrash(action.name, action.onConfirm, action.onAbort);
      case "value":
        return state.set("value", action.value);
      case "open":
        return state.set("open", action.value);
      case "set":
        return new PopupReducer(state.t, {
          ...(action.value instanceof Function
            ? action.value(state)
            : action.value),
          type: action.alerttype,
          open: true,
        });
      default:
        return state;
    }
  }
}
