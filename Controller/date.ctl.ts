import moment from "moment";

export class DateCtl {
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
  static toDateString(date:number):string{
    return moment(date).format("YYYY-MM-DD HH:mm")
  }
}
