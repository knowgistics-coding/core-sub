import { Timestamp } from "firebase/firestore";
import moment from "moment";

export type AnyDateType = Timestamp | Date | string | number | unknown | undefined;
export class DateCtl {
  static toNumber(date?: AnyDateType): number {
    if (date instanceof Date) {
      return date.getTime();
    } else if (date instanceof Timestamp) {
      return date.toMillis();
    } else if (
      typeof date === "string" &&
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/.test(date)
    ) {
      return new Date(date).getTime();
    } else if (typeof date === "number") {
      return date;
    } else {
      return Date.now();
    }
  }
  static getDateTime(addSecond: number = 0) {
    const newDate = new Date();
    newDate.setTime(newDate.getTime() + addSecond * 1000);
    return moment(newDate).format("YYYY-MM-DDTHH:mm");
  }
  static dateLocaleCompare(start: string, end: string): 0 | -1 | 1 {
    const dateStart = new Date(`${start}:00.0000`);
    const dateEnd = new Date(`${end}:00.0000`);
    if (dateStart.getTime() === dateEnd.getTime()) {
      return 0;
    } else if (dateStart.getTime() < dateEnd.getTime()) {
      return 1;
    } else {
      return -1;
    }
  }
  static toDateString(date: number): string {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }
  static toCoverDate(date: AnyDateType): string {
    const numberDate = this.toNumber(date);
    return moment(numberDate).format("DD MMMM YYYY");
  }
  static toCoverTime(date: AnyDateType): string {
    const numberDate = this.toNumber(date);
    return moment(numberDate).format("HH:mm");
  }
}
