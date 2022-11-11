import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  FieldValue,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { StockDisplayImageTypes, StockDisplayProps } from "../StockDisplay";
import { db } from "./firebase";
import { SkeMongo } from "./ske";
import { PageDoc, PageDocInitType } from "./page";
import moment from "moment";
import { MainCtl } from "./main.static";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { User } from "firebase/auth";
import { ExcludeMethods } from "./map";
import { cleanObject } from "../func";
import update from "react-addons-update";
import { arrayMoveImmutable } from "array-move";
import { genKey } from "draft-js";

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

export type CourseSchedule = {
  start: string;
  end: string;
  timezone: string;
};

/**
 *  $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$$\ $$$$$$$\  $$\   $$\ $$\       $$$$$$$$\
 * $$  __$$\ $$  __$$\ $$ |  $$ |$$  _____|$$  __$$\ $$ |  $$ |$$ |      $$  _____|
 * $$ /  \__|$$ /  \__|$$ |  $$ |$$ |      $$ |  $$ |$$ |  $$ |$$ |      $$ |
 * \$$$$$$\  $$ |      $$$$$$$$ |$$$$$\    $$ |  $$ |$$ |  $$ |$$ |      $$$$$\
 *  \____$$\ $$ |      $$  __$$ |$$  __|   $$ |  $$ |$$ |  $$ |$$ |      $$  __|
 * $$\   $$ |$$ |  $$\ $$ |  $$ |$$ |      $$ |  $$ |$$ |  $$ |$$ |      $$ |
 * \$$$$$$  |\$$$$$$  |$$ |  $$ |$$$$$$$$\ $$$$$$$  |\$$$$$$  |$$$$$$$$\ $$$$$$$$\
 *  \______/  \______/ \__|  \__|\________|\_______/  \______/ \________|\________|
 */

export class Schedule {
  start: string;
  end: string;
  timezone: string;

  constructor(data?: Partial<Schedule>) {
    this.start =
      data?.start ??
      moment(Date.now() - 60 * 60 * 1000).format("YYYY-MM-DDTHH:mm");
    this.end = data?.end ?? moment(Date.now()).format("YYYY-MM-DDTHH:mm");
    this.timezone = data?.timezone ?? "+07:00";
  }

  isComplete(): boolean {
    if (this.start && this.end && this.timezone) {
      const start = new Date(`${this.start}:00.000${this.timezone}`).getTime();
      const end = new Date(`${this.end}:00.000${this.timezone}`).getTime();
      if (start < end) {
        return true;
      }
    }
    return false;
  }

  isPublic(): boolean {
    if (this.start && this.end && this.timezone) {
      const start = new Date(`${this.start}:00.0000${this.timezone}`).getTime();
      const end = new Date(`${this.end}:00.0000${this.timezone}`).getTime();
      const now = new Date().getTime();
      return Boolean(start < now && now < end);
    }
    return false;
  }

  toJSON(): ExcludeMethods<Schedule> {
    const { start, end, timezone } = this;
    return {
      start,
      end,
      timezone,
    };
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  static reducer<T extends keyof Schedule>(
    state: Schedule,
    action: { type: "update"; field: T; value: Schedule[T] }
  ): Schedule {
    switch (action.type) {
      case "update":
        return new Schedule(state.set(action.field, action.value));
      default:
        return state;
    }
  }
}

/**
 *  $$$$$$\   $$$$$$\  $$\   $$\ $$$$$$$\   $$$$$$\  $$$$$$$$\
 * $$  __$$\ $$  __$$\ $$ |  $$ |$$  __$$\ $$  __$$\ $$  _____|
 * $$ /  \__|$$ /  $$ |$$ |  $$ |$$ |  $$ |$$ /  \__|$$ |
 * $$ |      $$ |  $$ |$$ |  $$ |$$$$$$$  |\$$$$$$\  $$$$$\
 * $$ |      $$ |  $$ |$$ |  $$ |$$  __$$<  \____$$\ $$  __|
 * $$ |  $$\ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$\   $$ |$$ |
 * \$$$$$$  | $$$$$$  |\$$$$$$  |$$ |  $$ |\$$$$$$  |$$$$$$$$\
 *  \______/  \______/  \______/ \__|  \__| \______/ \________|
 */

export class Course extends MainCtl {
  id: string;
  title: string;
  feature?: StockDisplayProps;
  syllabus: PageDoc | null;
  type: "course" = "course";
  schedule: Schedule;
  user: string;

  constructor(data?: Partial<Course>) {
    super(data);

    this.id = data?.id ?? Course.genId();
    this.title = data?.title ?? "";
    this.feature = data?.feature;
    this.syllabus = data?.syllabus ? new PageDoc({ ...data?.syllabus }) : null;
    this.schedule = new Schedule(data?.schedule);
    this.user = data?.user ?? "";
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    updateDoc(Course.doc(this.id), {
      [field]: value,
      datemodified: serverTimestamp(),
    });
  }

  private static doc(id: string): DocumentReference<DocumentData> {
    return doc(db, "lms", this.prefix, "courses", id);
  }
  private static collection(): CollectionReference<DocumentData> {
    return collection(db, "lms", this.prefix, "courses");
  }
  private static genId(): string {
    return doc(this.collection()).id;
  }

  static watchOne(id: string, callback: (doc: Course) => void) {
    return onSnapshot(this.doc(id), (snapshot) => {
      const course = new Course({ ...snapshot.data(), id });
      callback(course);
    });
  }
  static async getOne(id: string): Promise<Course> {
    const snapshot = await getDoc(this.doc(id));
    const course = new Course({ ...snapshot.data(), id });
    return course;
  }
}

/**
 *  $$$$$$\  $$\   $$\ $$$$$$\ $$$$$$$$\
 * $$  __$$\ $$ |  $$ |\_$$  _|\____$$  |
 * $$ /  $$ |$$ |  $$ |  $$ |      $$  /
 * $$ |  $$ |$$ |  $$ |  $$ |     $$  /
 * $$ |  $$ |$$ |  $$ |  $$ |    $$  /
 * $$ $$\$$ |$$ |  $$ |  $$ |   $$  /
 * \$$$$$$ / \$$$$$$  |$$$$$$\ $$$$$$$$\
 *  \___$$$\  \______/ \______|\________|
 *      \___|
 */

export class Quiz extends MainCtl {
  id?: string;
  title: string;
  type: "category" = "category";
  visibility: VisibilityTabsValue;
  parent: string;
  user: string;
  amount: number;

  constructor(data?: Partial<Quiz>) {
    super(data);

    this.id = data?.id;
    this.title = data?.title ?? "";
    this.visibility = data?.visibility ?? "private";
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.amount = data?.amount ?? 0;
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    if (this.id) {
      await updateDoc(Quiz.doc(this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  toJSON(): Pick<
    Quiz,
    "title" | "type" | "visibility" | "parent" | "user" | "amount"
  > {
    return {
      title: this.title,
      type: "category",
      visibility: this.visibility,
      parent: this.parent,
      user: this.user,
      amount: this.amount,
    };
  }

  async save(): Promise<void> {
    if (this.id) {
      await updateDoc(Quiz.doc(this.id), {
        ...cleanObject(this.toJSON()),
        datemodified: serverTimestamp(),
      });
    } else if (this.parent && this.user) {
      const doc = await addDoc(Quiz.collection(), {
        ...cleanObject(this.toJSON()),
        datecreate: serverTimestamp(),
        datemodified: serverTimestamp(),
      });
      this.id = doc.id;
    } else {
      throw new Error("Incomplete parameter (parent, user).");
    }
  }

  async remove(): Promise<void> {
    if (this.id) {
      await deleteDoc(Quiz.doc(this.id));
    }
  }

  protected static collection() {
    return collection(db, "lms", `${this.prefix}`, `questions`);
  }
  protected static doc(id: string) {
    return doc(db, "lms", `${this.prefix}`, `questions`, id);
  }
  static watch(
    user: User,
    parent: string,
    callback: (docs: Quiz[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(),
        where("user", "==", user.uid),
        where("parent", "==", parent),
        where("type", "==", "category")
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Quiz({ ...doc.data(), id: doc.id })
        );
        callback(docs);
      }
    );
  }
  static watchOne(
    user: User,
    courseId: string,
    quizId: string,
    callback: (data: {
      loading?: boolean;
      course?: Course;
      quiz?: Quiz;
      questions?: Question[];
    }) => void
  ): Unsubscribe {
    let loading: Record<"course" | "quiz" | "question", boolean> = {
      course: true,
      quiz: true,
      question: true,
    };
    Course.getOne(courseId).then((course) => {
      loading.course = false;
      callback({ course, loading: Object.values(loading).some((v) => v) });
    });
    const unsubscribeQuiz = onSnapshot(Quiz.doc(quizId), (snapshot) => {
      const quiz = new Quiz({ ...snapshot.data(), id: quizId });
      loading.quiz = false;
      callback({ quiz, loading: Object.values(loading).some((v) => v) });
    });
    const unsubscribeQuestions = Question.watchMany(
      user,
      quizId,
      (questions) => {
        loading.question = false;
        callback({ questions, loading: Object.values(loading).some((v) => v) });
      }
    );
    return () => {
      unsubscribeQuiz();
      unsubscribeQuestions();
    };
  }
  static async getOne(id: string): Promise<Quiz> {
    const snapshot = await getDoc(Quiz.doc(id));
    const quiz = new Quiz({ ...snapshot.data(), id });
    return quiz;
  }
  static async getMany(user: User, courseId: string): Promise<Quiz[]> {
    const snapshot = await getDocs(
      query(
        this.collection(),
        where("user", "==", user.uid),
        where("parent", "==", courseId)
      )
    );
    return snapshot.docs.map((doc) => new Quiz({ ...doc.data(), id: doc.id }));
  }
  static async preview(
    user: User,
    id: string
  ): Promise<{ quiz: Quiz; questions: Question[] }> {
    const quiz = await Quiz.getOne(id);
    if (!quiz) throw new Error("Quiz not found");

    const questions = await Question.getFromParent(user, id);
    return { quiz, questions };
  }
  static async add(user: User, parent: string, title: string): Promise<Quiz> {
    const quiz = new Quiz({ title, parent, user: user.uid });
    await quiz.save();
    return quiz;
  }
}

export type QuestionData = {
  key: string;
  type: "paragraph" | "image";
  value?: string;
  paragraph?: string;
  image?: StockDisplayImageTypes;
};

/**
 *  $$$$$$\  $$\   $$\ $$$$$$$$\  $$$$$$\ $$$$$$$$\ $$$$$$\  $$$$$$\  $$\   $$\
 * $$  __$$\ $$ |  $$ |$$  _____|$$  __$$\\__$$  __|\_$$  _|$$  __$$\ $$$\  $$ |
 * $$ /  $$ |$$ |  $$ |$$ |      $$ /  \__|  $$ |     $$ |  $$ /  $$ |$$$$\ $$ |
 * $$ |  $$ |$$ |  $$ |$$$$$\    \$$$$$$\    $$ |     $$ |  $$ |  $$ |$$ $$\$$ |
 * $$ |  $$ |$$ |  $$ |$$  __|    \____$$\   $$ |     $$ |  $$ |  $$ |$$ \$$$$ |
 * $$ $$\$$ |$$ |  $$ |$$ |      $$\   $$ |  $$ |     $$ |  $$ |  $$ |$$ |\$$$ |
 * \$$$$$$ / \$$$$$$  |$$$$$$$$\ \$$$$$$  |  $$ |   $$$$$$\  $$$$$$  |$$ | \$$ |
 *  \___$$$\  \______/ \________| \______/   \__|   \______| \______/ \__|  \__|
 *      \___|
 *  $$$$$$\  $$\   $$\  $$$$$$\  $$$$$$$$\ $$\      $$\ $$$$$$$$\ $$$$$$$\
 * $$  __$$\ $$$\  $$ |$$  __$$\ $$  _____|$$ | $\  $$ |$$  _____|$$  __$$\
 * $$ /  $$ |$$$$\ $$ |$$ /  \__|$$ |      $$ |$$$\ $$ |$$ |      $$ |  $$ |
 * $$$$$$$$ |$$ $$\$$ |\$$$$$$\  $$$$$\    $$ $$ $$\$$ |$$$$$\    $$$$$$$  |
 * $$  __$$ |$$ \$$$$ | \____$$\ $$  __|   $$$$  _$$$$ |$$  __|   $$  __$$<
 * $$ |  $$ |$$ |\$$$ |$$\   $$ |$$ |      $$$  / \$$$ |$$ |      $$ |  $$ |
 * $$ |  $$ |$$ | \$$ |\$$$$$$  |$$$$$$$$\ $$  /   \$$ |$$$$$$$$\ $$ |  $$ |
 * \__|  \__|\__|  \__| \______/ \________|\__/     \__|\________|\__|  \__|
 */

export class QuestionAnswer {
  answer: string;
  matching: Record<string, string>;
  sorting: string[];
  type: Question["type"];

  constructor(data?: Partial<QuestionAnswer>) {
    this.answer = data?.answer ?? "";
    this.matching = data?.matching ?? {};
    this.sorting = data?.sorting ?? [];
    this.type = data?.type ?? "multiple";
  }

  check(question: Question): boolean {
    if (question.type === "truefalse") {
      return question.answer === this.answer;
    } else if (question.type === "multiple") {
      return question.answer === this.answer;
    } else if (question.type === "matching") {
      return question.options.every(
        (option) => option.value === this.matching[option.key]
      );
    } else if (question.type === "sorting") {
      return question.answers.every(
        (key, index) => String(key) === this.sorting[index]
      );
    }
    return false;
  }

  setAnswer(value: string): this {
    this.answer = value;
    return this;
  }

  setMatching(key: string, value: string): this {
    this.matching[key] = value;
    return this;
  }

  setSorting(sorting: string[]): this {
    this.sorting = sorting;
    return this;
  }
}

/**
 *  $$$$$$\  $$\   $$\ $$$$$$$$\  $$$$$$\ $$$$$$$$\ $$$$$$\  $$$$$$\  $$\   $$\
 * $$  __$$\ $$ |  $$ |$$  _____|$$  __$$\\__$$  __|\_$$  _|$$  __$$\ $$$\  $$ |
 * $$ /  $$ |$$ |  $$ |$$ |      $$ /  \__|  $$ |     $$ |  $$ /  $$ |$$$$\ $$ |
 * $$ |  $$ |$$ |  $$ |$$$$$\    \$$$$$$\    $$ |     $$ |  $$ |  $$ |$$ $$\$$ |
 * $$ |  $$ |$$ |  $$ |$$  __|    \____$$\   $$ |     $$ |  $$ |  $$ |$$ \$$$$ |
 * $$ $$\$$ |$$ |  $$ |$$ |      $$\   $$ |  $$ |     $$ |  $$ |  $$ |$$ |\$$$ |
 * \$$$$$$ / \$$$$$$  |$$$$$$$$\ \$$$$$$  |  $$ |   $$$$$$\  $$$$$$  |$$ | \$$ |
 *  \___$$$\  \______/ \________| \______/   \__|   \______| \______/ \__|  \__|
 *      \___|
 */
export type QuestionType = "truefalse" | "matching" | "sorting" | "multiple";
export type QuestionValue = {
  [key in QuestionType]: {
    answer: string;
    options: QuestionData[];
    answers: string[];
  };
};

export class Question extends MainCtl {
  id?: string;
  type: "truefalse" | "matching" | "sorting" | "multiple";
  title: string;
  question: Omit<QuestionData, "key">;
  shuffle: boolean;
  user: string;
  courseparent: string;
  questionparent: string;

  options: QuestionData[];
  answers: string[];
  answer: string;

  constructor(data?: Partial<Question & QuestionValue>) {
    super(data);

    this.id = data?.id;
    this.type = data?.type ?? "multiple";
    this.title = data?.title ?? "";
    this.shuffle = data?.shuffle ?? false;
    this.user = data?.user ?? "";
    this.courseparent = data?.courseparent ?? "";
    this.questionparent = data?.questionparent ?? "";

    this.question = data?.question ?? { type: "paragraph" };

    this.options = data?.options ?? data?.[this.type]?.options ?? [];
    this.answers = data?.answers ?? data?.[this.type]?.answers ?? [];
    this.answer = data?.answer ?? data?.[this.type]?.answer ?? "false";

    this.initQuestion();
  }

  toJSON(): Pick<
    this,
    | "type"
    | "title"
    | "question"
    | "shuffle"
    | "user"
    | "courseparent"
    | "questionparent"
  > {
    const {
      type,
      title,
      question,
      shuffle,
      user,
      courseparent,
      questionparent,
    } = this;
    return {
      type,
      title,
      question,
      shuffle,
      user,
      courseparent,
      questionparent,
    };
  }

  set<T extends keyof this>(
    field: T,
    value?: this[T] | null,
    callback?: (data: this[T]) => this[T]
  ): this {
    if (callback) {
      this[field] = callback(this[field]);
    } else if (value) {
      this[field] = value;
    }
    if (field === "type") {
      this.initQuestion();
    }
    return this;
  }

  initQuestion() {
    const keys = [genKey(), genKey()];
    if (this.type === "multiple" && this.options.length < 2) {
      this.options = this.options.concat(
        { key: keys[0], type: "paragraph" },
        { key: keys[1], type: "paragraph" }
      );
      this.answer = keys[0];
    } else if (
      this.type === "truefalse" &&
      ["true", "false"].includes(this.answer) === false
    ) {
      this.answer = "false";
    } else if (this.type === "matching" && this.options.length < 2) {
      this.options = this.options.concat(
        { key: keys[0], type: "paragraph" },
        { key: keys[1], type: "paragraph" }
      );
    } else if (this.type === "sorting" && this.options.length < 2) {
      this.options = this.options.concat(
        { key: keys[0], type: "paragraph" },
        { key: keys[1], type: "paragraph" }
      );
      this.answers = keys;
    }
  }

  addOption(): this {
    const key = genKey();
    this.options = this.options.concat({ key, type: "paragraph" });
    this.answers = this.answers.concat(key);
    return this;
  }

  setOption(index: number, option: Partial<Omit<QuestionData, "key">>): this {
    if (index < this.options.length) {
      this.options[index] = update(this.options[index], { $merge: option });
    }
    return this;
  }

  moveOption(oldIndex: number, newIndex: number): this {
    this.options = arrayMoveImmutable(this.options, oldIndex, newIndex);
    return this;
  }

  removeOption(key: string): this {
    this.options = this.options.filter((option) => option.key !== key);
    this.answers = this.options.map((option) => option.key);
    return this;
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    if (this.id) {
      await updateDoc(Question.doc(this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  async save(): Promise<void> {
    if (this.user && this.courseparent && this.questionparent) {
      const newData = cleanObject({
        ...this.toJSON(),
        [this.type]: {
          options: this.options,
          answer: this.answer,
          answers: this.answers,
        },
      });
      if (this.id) {
        await updateDoc(Question.doc(this.id), {
          ...newData,
          datemodified: serverTimestamp(),
        });
      } else {
        const doc = await addDoc(Question.collection(), {
          ...newData,
          datecreate: serverTimestamp(),
          datemodified: serverTimestamp(),
        });
        this.id = doc.id;
      }
    } else {
      throw new Error(
        "Incomplete parameter (user, courseparent, questionparent)."
      );
    }
  }

  async remove(): Promise<void> {
    if (this.id) {
      const quiz = await Quiz.getOne(this.questionparent);
      await quiz.update("amount", increment(1));
      await deleteDoc(Question.doc(this.id));
    }
  }

  protected static collection() {
    return collection(db, "lms", `${this.prefix}`, `questions`);
  }
  protected static doc(id: string) {
    return doc(db, "lms", `${this.prefix}`, `questions`, id);
  }
  static watchMany(
    user: User,
    quizId: string,
    callback: (docs: Question[]) => void
  ) {
    return onSnapshot(
      query(
        this.collection(),
        where("user", "==", user.uid),
        where("questionparent", "==", quizId)
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Question({ ...doc.data(), id: doc.id })
        );
        callback(docs);
      },
      (error) => {
        throw new Error(error.message);
      }
    );
  }
  static async getFromParent(
    user: User,
    parentId: string
  ): Promise<Question[]> {
    const questions = (
      await getDocs(
        query(
          this.collection(),
          where("user", "==", user.uid),
          where("questionparent", "==", parentId)
        )
      )
    ).docs.map((doc) => new Question({ ...doc.data(), id: doc.id }));
    return questions;
  }
  static async getOne(id: string): Promise<Question> {
    const snapshot = await getDoc(this.doc(id));
    const question = new Question({ ...snapshot.data(), id });
    return question;
  }
  static async add(
    user: User,
    courseparent: string,
    questionparent: string,
    title: string
  ): Promise<Question> {
    const quiz = await Quiz.getOne(questionparent);
    await quiz.update("amount", increment(1));
    const question = new Question({
      title,
      courseparent,
      questionparent,
      user: user.uid,
    });
    await question.save();
    return question;
  }
}

/**
 * $$\       $$$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$\  $$\   $$\
 * $$ |      $$  _____|$$  __$$\ $$  __$$\ $$  __$$\ $$$\  $$ |
 * $$ |      $$ |      $$ /  \__|$$ /  \__|$$ /  $$ |$$$$\ $$ |
 * $$ |      $$$$$\    \$$$$$$\  \$$$$$$\  $$ |  $$ |$$ $$\$$ |
 * $$ |      $$  __|    \____$$\  \____$$\ $$ |  $$ |$$ \$$$$ |
 * $$ |      $$ |      $$\   $$ |$$\   $$ |$$ |  $$ |$$ |\$$$ |
 * $$$$$$$$\ $$$$$$$$\ \$$$$$$  |\$$$$$$  | $$$$$$  |$$ | \$$ |
 * \________|\________| \______/  \______/  \______/ \__|  \__|
 */

export class Lesson extends PageDoc {
  id?: string;
  schedule: Schedule;

  constructor(
    data?: PageDocInitType & Partial<Pick<Lesson, "id" | "schedule">>
  ) {
    super(data);

    this.id = data?.id;
    this.schedule = new Schedule(data?.schedule);
  }

  async save() {
    if (this.id) {
      await updateDoc(Lesson.doc(this.id), {
        ...cleanObject(this.toJSON()),
        datemodified: serverTimestamp(),
        schedule: this.schedule.toJSON(),
      });
    }
  }

  /**
   *  $$$$$$\  $$\   $$\  $$$$$$\   $$$$$$\  $$\   $$\
   * $$  __$$\ $$ |  $$ |$$  __$$\ $$  __$$\ $$ |  $$ |
   * $$ /  $$ |$$ |  $$ |$$$$$$$$ |$$ |  \__|$$ |  $$ |
   * $$ |  $$ |$$ |  $$ |$$   ____|$$ |      $$ |  $$ |
   * \$$$$$$$ |\$$$$$$  |\$$$$$$$\ $$ |      \$$$$$$$ |
   *  \____$$ | \______/  \_______|\__|       \____$$ |
   *       $$ |                              $$\   $$ |
   *       $$ |                              \$$$$$$  |
   *       \__|                               \______/
   */
  private static prefix: string = `${process.env.REACT_APP_PREFIX}`;
  protected static collection() {
    return collection(db, "lms", `${this.prefix}`, `courses`);
  }
  protected static doc(id: string) {
    return doc(db, "lms", `${this.prefix}`, `courses`, id);
  }
  static async getLastSort(courseId: string) {
    const snapshot = await getDocs(
      query(this.collection(), where("parent", "==", courseId))
    );
    return (
      snapshot.docs
        .map((doc) => doc.data())
        .reduce((large, doc) => (large < doc?.sort ? doc.sort : large), 0) + 1
    );
  }
}
