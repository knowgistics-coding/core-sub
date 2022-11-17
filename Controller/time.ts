import { Timestamp } from "firebase/firestore";
import moment from "moment";

export class Time {
  value: number;

  constructor(date: Date | Timestamp | number) {
    if (date instanceof Date) {
      this.value = date.getTime();
    } else if (date instanceof Timestamp) {
      this.value = date.toMillis();
    } else if (typeof date === "number") {
      this.value = date;
    } else {
      this.value = Date.now();
    }
  }

  toString(): string {
    return moment(this.value).format("YYYY-MM-DD HH:mm");
  }

  toShort(): string {
    const diff = (Date.now() - this.value) / 1000;
    if (diff < 60) {
      return `now`;
    } else if (diff < 60 * 60) {
      return `${Math.floor(diff / 60)}m`;
    } else if (diff < 24 * 60 * 60) {
      return `${Math.floor(diff / (60 * 60))}h`;
    } else if (diff < 7 * 24 * 60 * 60) {
      return `${Math.floor(diff / (24 * 60 * 60))}d`;
    } else if (diff < 365 * 24 * 60 * 60) {
      return `${Math.floor(diff / (7 * 24 * 60 * 60))}w`;
    } else {
      return `${Math.floor(diff / (365 * 24 * 60 * 60))}y`;
    }
  }
}
