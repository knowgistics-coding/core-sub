import { Timestamp } from "firebase/firestore";
import moment from "moment";

export class DateCtl {
  static toNumber(date?: Timestamp | Date | number): number {
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
}
