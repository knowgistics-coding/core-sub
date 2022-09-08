import { StockDisplayProps } from "../StockDisplay";
import { SkeMongo } from "./ske";

export interface CourseMongoDocument {
  _id?: string;
  feature?: StockDisplayProps;
  category?: string;
  datecreate: Date;
  datemodified: Date;
  desc?: string;
  prefix?: string;
  ref?: string;
  service?: string;
  subscribe?: string[];
  teacher?: string;
  title?: string;
  type: "course";
  user: string;
  visibility: "public" | "private" | "trash";
}

export class CourseMongo extends SkeMongo {
  async list(): Promise<any[]> {
    return this.get<CourseMongoDocument[]>(
      `${this.baseUrl}/course/list/`,
      "GET"
    );
  }

  async add(..._param: any[]): Promise<any> {
    return null;
  }
  async remove(..._param: any[]): Promise<any> {
    return null;
  }
}
