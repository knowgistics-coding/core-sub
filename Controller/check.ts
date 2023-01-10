export class Checking<T> {
  selection: T[];
  update: (selection: T[]) => void;

  constructor(selection: T[], update: (selection: T[]) => void) {
    this.selection = selection;
    this.update = update;
  }

  change(id: T, checked: boolean) {
    this.selection = checked ? this.check(id) : this.uncheck(id);
    this.update(this.selection);
  }

  toggle(id: T) {
    this.selection = this.selection.includes(id)
      ? this.uncheck(id)
      : this.check(id);
    this.update(this.selection);
  }

  clear() {
    this.selection = [];
    this.update(this.selection);
  }

  private check(id: T): T[] {
    return this.unique(this.selection.concat(id));
  }

  uncheck(id: T): T[] {
    return this.unique(this.selection.filter((select) => select !== id));
  }

  private unique(selection: T[]): T[] {
    return selection.filter((s, i, a) => a.indexOf(s) === i);
  }
}
