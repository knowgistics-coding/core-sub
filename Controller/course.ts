import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  deleteField,
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
import { db, dbTimestamp } from "./firebase";
import { SkeMongo } from "./ske";
import { PageDoc, PageDocInitType } from "./page";
import moment from "moment";
import { MainCtl, MainStatic } from "./main.static";
import { VisibilityTabsValue } from "../VisibilityTabs";
import { User } from "firebase/auth";
import { ExcludeMethods, Map } from "./map";
import { arrayShuffle, cleanObject } from "../func";
import update from "react-addons-update";
import { arrayMoveImmutable } from "array-move";
import { genKey } from "draft-js";
import { DateCtl } from "./date.ctl";
import { Material as CourseMaterial } from "./course.material";
import { User as MekUser } from "./user";
import { LocaleKey } from "../Translate/en_th";
import { PickIconName } from "../PickIcon";
import { FileCtl, FileDocument } from "./files.static";
import { PageContentTypes } from "../PageEdit";

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

//SECTION - CLASS: Course
export class Course extends MainCtl {
  id: string;
  title: string;
  feature?: StockDisplayProps;
  syllabus: PageDoc | null;
  type: "course" = "course";
  prefix: null | string = process.env.REACT_APP_PREFIX ?? null;
  schedule: Schedule;
  user: string;
  visibility: VisibilityTabsValue;
  path: string;
  enroll: Record<string, boolean>;

  constructor(data?: Partial<Course>) {
    super(data);

    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.feature = data?.feature;
    this.syllabus = data?.syllabus ? new PageDoc({ ...data?.syllabus }) : null;
    this.schedule = new Schedule(data?.schedule);
    this.user = data?.user ?? "";
    this.visibility = this.getVisibiliy(data?.visibility);
    this.path = data?.path ?? "";
    this.enroll = data?.enroll ?? {};
  }

  getVisibiliy(visibility?: VisibilityTabsValue): VisibilityTabsValue {
    if (visibility) {
      return visibility;
    } else if (this.schedule) {
      const { end, timezone } = this.schedule;
      const dateend = new Date(`${end}:00.0000${timezone}`);
      return dateend.getTime() > Date.now() ? "public" : "private";
    }
    return "private";
  }

  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    updateDoc(Course.doc(this.user, this.id), {
      [field]: value,
      datemodified: serverTimestamp(),
    });
  }

  async remove(user: User) {
    if (this.id) {
      const quiz = await Quiz.getMany(user, this.id);
      const questions = (
        await Promise.all(
          quiz.map(async (q) =>
            q.id ? await Question.getFromParent(user, q.id) : []
          )
        )
      ).reduce((total, qs) => total.concat(...qs), []);
      const sections = await Section.getMany(user, this.id);

      await Promise.all(sections.map((section) => section.remove(user)));
      await Promise.all(questions.map((question) => question.remove(user)));
      await Promise.all(quiz.map((q) => q.remove()));

      await deleteDoc(Course.doc(this.user, this.id));
    }
  }

  async Enroll(user?: User) {
    const paths = this.path.split("/");
    if (user && this.id && paths.length === 4) {
      await updateDoc(Course.doc(paths[1], this.id), {
        [`enroll.${user.uid}`]: true,
      });
    }
  }

  async Unenroll(user?: User) {
    const paths = this.path.split("/");
    if (user && this.id && paths.length === 4) {
      await updateDoc(Course.doc(paths[1], this.id), {
        [`enroll.${user.uid}`]: deleteField(),
      });
    }
  }

  Teach() {
    return {
      unenroll: async (uid: string) => {
        const paths = this.path.split("/");
        if (paths.length === 4) {
          await updateDoc(Course.doc(paths[1], this.id), {
            [`enroll.${uid}`]: deleteField(),
          });
        }
      },
    };
  }

  //SECTION - STATIC
  //ANCHOR - doc
  static doc(uid: string, id: string): DocumentReference<DocumentData> {
    return doc(db, "users", uid, "documents", id);
  }
  //ANCHOR - collection
  static collection(uid: string): CollectionReference<DocumentData> {
    return collection(db, "users", uid, "documents");
  }

  //ANCHOR - watchOne
  static watchOne(user: User, id: string, callback: (doc: Course) => void) {
    return onSnapshot(this.doc(user.uid, id), (snapshot) => {
      const course = new Course({
        ...snapshot.data(),
        path: snapshot.ref.path,
        id,
      });
      callback(course);
    });
  }

  //ANCHOR - watchMany
  static watchMany(user: User, callback: (docs: Course[]) => void) {
    return onSnapshot(
      query(
        this.collection(user.uid),
        where("type", "==", "course"),
        where("user", "==", user.uid)
      ),
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Course({ ...doc.data(), path: doc.ref.path, id: doc.id })
        );
        callback(docs);
      }
    );
  }

  //ANCHOR - getOne
  static async getOne(user: User, id: string): Promise<Course> {
    const snapshot = await getDoc(this.doc(user.uid, id));
    const course = new Course({
      ...snapshot.data(),
      path: snapshot.ref.path,
      id,
    });
    return course;
  }

  //ANCHOR - getVisibility
  static getVisibility(courses: Course[], value: VisibilityTabsValue) {
    switch (value) {
      case "public":
        return courses.filter((course) => course.visibility === "public");
      case "private":
        return courses.filter((course) => course.visibility === "private");
      case "trash":
        return courses.filter((course) => course.visibility === "trash");
      default:
        return [];
    }
  }

  //ANCHOR - Add
  static async add(user: User, title: string) {
    const data = {
      title,
      datecreate: dbTimestamp(),
      datemodified: dbTimestamp(),
      user: user.uid,
      type: "course",
    };
    return await addDoc(this.collection(user.uid), data);
  }
  //!SECTION

  //ANCHOR - view
  static view(_user: User, uid: string, id: string) {
    return new Promise<Course>(async (resolve, reject) => {
      getDoc(this.doc(uid, id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(
            new Course({ ...snapshot.data(), id, path: snapshot.ref.path })
          );
        } else {
          reject(new Error("Course Not Found"));
        }
      });
    });
  }
}
//!SECTION

//SECTION - CourseView
export class CourseView extends Course {
  sectionName: string;

  //ANCHOR - constructor
  constructor(data?: Partial<CourseView>) {
    super(data);

    this.sectionName = data?.sectionName ?? "section_name";
  }

  //ANCHOR - [static] view
  static view(user: User, id: string) {
    return new Promise<CourseView>(async (resolve, reject) => {
      getDoc(Course.doc(user.uid, id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(
            new CourseView({ ...snapshot.data(), path: snapshot.ref.path, id })
          );
        } else {
          reject(new Error("Course Not Found"));
        }
      });
    });
  }
}
//!SECTION

//SECTION - SECTION
export type SectionValue = ExcludeMethods<
  Omit<
    Section,
    "id" | "datecreate" | "datemodified" | "course" | "userinfo" | "users"
  >
>;
export class Section {
  id: string;
  title: string;
  datecreate: number;
  datemodified: number;
  parent: string;
  regard: Record<string, boolean>;
  students: string[];
  ta: string[];
  type: "section" = "section";
  prefix: string | null = process.env.REACT_APP_PREFIX ?? null;
  user: string;
  weights: Record<string, { score: number; weight: 6 }>;
  course: null | Course;
  userinfo: null | MekUser;
  users: MekUser[];

  constructor(data?: Partial<Section>) {
    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.parent = data?.parent ?? "";
    this.regard = data?.regard ?? {};
    this.students = data?.students ?? [];
    this.ta = data?.ta ?? [];
    this.user = data?.user ?? "";
    this.weights = data?.weights ?? {};
    this.course = data?.course ? new Course(data.course) : null;
    this.userinfo = data?.userinfo ? new MekUser(data.userinfo) : null;
    this.users = data?.users ? data.users.map((u) => new MekUser(u)) : [];
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  //ANCHOR - update
  async update<T extends keyof this>(
    field: T,
    value: ((data: this[T]) => this[T]) | this[T]
  ): Promise<Section> {
    if (this.id) {
      await updateDoc(Course.doc(this.user, this.id), {
        [field]: value instanceof Function ? value(this[field]) : value,
        datemodified: serverTimestamp(),
      });
      return new Section({
        ...this,
        [field]: value instanceof Function ? value(this[field]) : value,
      });
    }
    return new Section(this);
  }

  async remove(user: User) {
    if (this.id) {
      await deleteDoc(Course.doc(user.uid, this.id));
    }
  }

  val(): SectionValue {
    const data = Object.entries(this)
      .filter(
        ([key, value]) =>
          value instanceof Function === false &&
          [
            "id",
            "datecreate",
            "datemodified",
            "course",
            "userinfo",
            "users",
          ].includes(key) === false
      )
      .reduce<SectionValue>(
        (data, [key, value]) => Object.assign(data, { [key]: value }),
        {
          title: "",
          parent: "",
          regard: {},
          students: [],
          ta: [],
          type: "section",
          prefix: "",
          user: "",
          weights: {},
        }
      );
    return data;
  }

  Student() {
    return {
      add: async (user: User, uids: string[]) => {
        return await updateDoc(Course.doc(user.uid, this.id), {
          students: arrayUnion(...uids),
          datemodified: dbTimestamp(),
        });
      },
      remove: async (user: User, uids: string[]) => {
        return await updateDoc(Course.doc(user.uid, this.id), {
          students: arrayRemove(...uids),
          datemodified: dbTimestamp(),
        });
      },
    };
  }

  //SECTION - STATIC

  //ANCHOR - Watch
  static Watch() {
    return {
      withStudents: (
        user: User,
        sectionId: string,
        callback: (doc: Section) => void
      ): Unsubscribe => {
        return onSnapshot(Course.doc(user.uid, sectionId), async (snapshot) => {
          let doc = new Section({ ...snapshot.data(), id: sectionId });
          const users = await MekUser.getUsers(user, doc.students);
          doc = doc.set("users", users);
          callback(doc);
        });
      },
    };
  }

  //ANCHOR - watch
  static watch(
    user: User,
    sectionId: string,
    callback: (section: Section) => void
  ): Unsubscribe {
    return onSnapshot(Course.doc(user.uid, sectionId), (snapshot) => {
      const section = new Section({ ...snapshot.data(), id: sectionId });
      callback(section);
    });
  }

  //ANCHOR - getMany
  static async getMany(user: User, courseId: string): Promise<Section[]> {
    const snapshot = await getDocs(
      query(
        Course.collection(user.uid),
        where("user", "==", user.uid),
        where("parent", "==", courseId)
      )
    );
    const docs = snapshot.docs.map(
      (doc) => new Section({ ...doc.data(), id: doc.id })
    );
    return docs;
  }

  //ANCHOR - getMany
  static watchMany(
    user: User,
    courseId: string,
    callback: (docs: Section[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        Course.collection(user.uid),
        where("user", "==", user.uid),
        where("parent", "==", courseId)
      ),
      (snapshot) => {
        const docs = snapshot.docs
          .filter((doc) => doc.data().type === "section")
          .map((doc) => new Section({ ...doc.data(), id: doc.id }));
        callback(docs);
      }
    );
  }

  static async add(user: User, title: string, courseId: string) {
    const data = new Section({
      title,
      parent: courseId,
      user: user.uid,
      type: "section",
    });
    return await addDoc(Course.collection(user.uid), {
      ...data.val(),
      datecreate: dbTimestamp(),
      datemodified: dbTimestamp(),
      user: user.uid,
    });
  }

  static Get() {
    return {
      one: async (user: User, sectionId: string): Promise<Section> => {
        const snapshot = await getDoc(Course.doc(user.uid, sectionId));
        if (snapshot.exists()) {
          return new Section({ ...snapshot.data(), id: sectionId });
        } else {
          throw new Error("Section not found");
        }
      },
      oneWithStudent: async (
        user: User,
        sectionId: string
      ): Promise<Section> => {
        const snapshot = await getDoc(Course.doc(user.uid, sectionId));
        let doc = new Section({ ...snapshot.data(), id: snapshot.id });
        const users = await MekUser.getUsers(user, doc.students);
        doc = doc.set("users", users);
        return doc;
      },
    };
  }

  //!SECTION
}
//!SECTION

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
//SECTION - Quiz
export class Quiz extends MainCtl {
  id?: string;
  title: string;
  type: "category" = "category";
  visibility: VisibilityTabsValue;
  parent: string;
  user: string;
  amount: number;
  attemps: number;

  //ANCHOR - constructor
  constructor(data?: Partial<Quiz>) {
    super(data);

    this.id = data?.id;
    this.title = data?.title ?? "";
    this.visibility = data?.visibility ?? "private";
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.amount = parseInt(String(data?.amount ?? 0));
    this.attemps = parseInt(String(data?.attemps ?? 0));
  }

  //ANCHOR - update
  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    if (this.id) {
      await updateDoc(Quiz.doc(this.user, this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  //ANCHOR - toJSON
  val(): Pick<
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

  //ANCHOR - save
  async save(): Promise<void> {
    if (this.id) {
      await updateDoc(Quiz.doc(this.user, this.id), {
        ...cleanObject(this.val()),
        datemodified: serverTimestamp(),
      });
    } else if (this.parent && this.user) {
      const doc = await addDoc(Quiz.collection(this.user), {
        ...cleanObject(this.val()),
        datecreate: serverTimestamp(),
        datemodified: serverTimestamp(),
      });
      this.id = doc.id;
    } else {
      throw new Error("Incomplete parameter (parent, user).");
    }
  }

  //ANCHOR - remove
  async remove(): Promise<void> {
    if (this.id) {
      await deleteDoc(Quiz.doc(this.user, this.id));
    }
  }

  //ANCHOR - [static] collection
  static collection(uid: string) {
    return collection(db, "users", uid, "questions");
  }

  //ANCHOR - [static] doc
  static doc(uid: string, id: string) {
    return doc(db, "users", uid, "questions", id);
  }

  //ANCHOR - [static] watch
  static watch(
    user: User,
    parent: string,
    callback: (docs: Quiz[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection(user.uid),
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

  //ANCHOR - [static] watchOne
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
    Course.getOne(user, courseId).then((course) => {
      loading.course = false;
      callback({ course, loading: Object.values(loading).some((v) => v) });
    });
    const unsubscribeQuiz = onSnapshot(
      Quiz.doc(user.uid, quizId),
      (snapshot) => {
        const quiz = new Quiz({ ...snapshot.data(), id: quizId });
        loading.quiz = false;
        callback({ quiz, loading: Object.values(loading).some((v) => v) });
      }
    );
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

  //ANCHOR - [static] getOne
  static async getOne(user: User, id: string): Promise<Quiz> {
    const snapshot = await getDoc(Quiz.doc(user.uid, id));
    const quiz = new Quiz({ ...snapshot.data(), id });
    return quiz;
  }
  static async getMany(user: User, courseId: string): Promise<Quiz[]> {
    const snapshot = await getDocs(
      query(
        this.collection(user.uid),
        where("user", "==", user.uid),
        where("parent", "==", courseId)
      )
    );
    return snapshot.docs.map((doc) => new Quiz({ ...doc.data(), id: doc.id }));
  }

  //ANCHOR - [static] preview
  static async preview(
    user: User,
    id: string
  ): Promise<{ material: CourseMaterial; questions: Question[] }> {
    const material = await CourseMaterial.getOne(id);
    const questions = await Question.getFromParent(user, material.quizId);
    return {
      material,
      questions: arrayShuffle(questions).slice(0, material.amount),
    };
  }

  //ANCHOR - [static] add
  static async add(user: User, parent: string, title: string): Promise<Quiz> {
    const quiz = new Quiz({ title, parent, user: user.uid });
    await quiz.save();
    return quiz;
  }

  //ANCHOR - [static] managePreview
  static async managerPreview(
    user: User,
    quizId: string
  ): Promise<{ quiz: Quiz; questions: Question[] }> {
    const quiz = await this.getOne(user, quizId);
    const questions = await Question.getFromParent(user, quizId);
    return { quiz, questions };
  }

  //ANCHOR - [static] making
  static async making(
    uid: string,
    itemId: string
  ): Promise<{ quiz: Material; questions: Question[] }> {
    const quiz = await Material.Get().one(uid, itemId);
    const questions = await getDocs(
      query(this.collection(uid), where("questionparent", "==", quiz.quizId))
    ).then((snapshot) =>
      snapshot.docs.map((doc) => new Question({ ...doc.data(), id: doc.id }))
    );
    return { quiz, questions };
  }
}
//!SECTION

//ANCHOR - QuestionData
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

//SECTION - QuestionAnswer
export class QuestionAnswer {
  answer: string;
  matching: Record<string, string>;
  sorting: string[];
  type: Question["type"];

  //ANCHOR - constructor
  constructor(data?: Partial<QuestionAnswer>) {
    this.answer = data?.answer ?? "";
    this.matching = data?.matching ?? {};
    this.sorting = data?.sorting ?? [];
    this.type = data?.type ?? "multiple";
  }

  //ANCHOR - check
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

  //ANCHOR - setAnswer
  setAnswer(value: string): this {
    this.answer = value;
    return this;
  }

  //ANCHOR - setMatching
  setMatching(key: string, value: string): this {
    this.matching[key] = value;
    return this;
  }

  //ANCHOR - setSorting
  setSorting(sorting: string[]): this {
    this.sorting = sorting;
    return this;
  }
}
//!SECTION

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

//ANCHOR - QuestionType
export type QuestionType = "truefalse" | "matching" | "sorting" | "multiple";

//ANCHOR - QuestionValue
export type QuestionValue = {
  [key in QuestionType]: {
    answer: string;
    options: QuestionData[];
    answers: string[];
  };
};

//SECTION - Question
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

  visibility: VisibilityTabsValue = "public";

  //ANCHOR - constructor
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

  //ANCHOR - val
  val(): Pick<
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

  //ANCHOR - set
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

  //ANCHOR - initQuestion
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

  //ANCHOR - addOption
  addOption(): this {
    const key = genKey();
    this.options = this.options.concat({ key, type: "paragraph" });
    this.answers = this.options.map((op) => op.key);
    return this;
  }

  //ANCHOR - setOption
  setOption(index: number, option: Partial<Omit<QuestionData, "key">>): this {
    if (index < this.options.length) {
      this.options[index] = update(this.options[index], { $merge: option });
    }
    return this;
  }

  //ANCHOR - moveOption
  moveOption(oldIndex: number, newIndex: number): this {
    this.options = arrayMoveImmutable(this.options, oldIndex, newIndex);
    if (this.type === "sorting") {
      this.answers = this.options.map((option) => option.key);
    }
    return this;
  }

  //ANCHOR - removeOption
  removeOption(key: string): this {
    this.options = this.options.filter((option) => option.key !== key);
    this.answers = this.options.map((option) => option.key);
    return this;
  }

  //ANCHOR - update
  async update<T extends keyof this>(
    field: T,
    value: this[T] | FieldValue | unknown
  ): Promise<void> {
    if (this.id) {
      await updateDoc(Course.doc(this.user, this.id), {
        [field]: value,
        datemodified: serverTimestamp(),
      });
    }
  }

  //ANCHOR - save
  async save(): Promise<void> {
    if (this.user && this.courseparent && this.questionparent) {
      const newData = cleanObject({
        ...this.val(),
        [this.type]: {
          options: this.options,
          answer: this.answer,
          answers: this.options.map((op) => op.key),
        },
      });
      if (this.id) {
        await updateDoc(Quiz.doc(this.user, this.id), {
          ...newData,
          datemodified: serverTimestamp(),
        });
      } else {
        const doc = await addDoc(Quiz.collection(this.user), {
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

  //ANCHOR - remove
  async remove(user: User): Promise<void> {
    if (this.id) {
      const quiz = await Quiz.getOne(user, this.questionparent);
      await quiz.update("amount", increment(1));
      await deleteDoc(Course.doc(this.user, this.id));
    }
  }

  //ANCHOR - [static] watchMany
  static watchMany(
    user: User,
    quizId: string,
    callback: (docs: Question[]) => void
  ) {
    return onSnapshot(
      query(
        Quiz.collection(user.uid),
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

  ///ANCHOR - [static] getFRromParent
  static async getFromParent(
    user: User,
    parentId: string
  ): Promise<Question[]> {
    const questions = (
      await getDocs(
        query(
          Quiz.collection(user.uid),
          where("user", "==", user.uid),
          where("questionparent", "==", parentId)
        )
      )
    ).docs.map((doc) => new Question({ ...doc.data(), id: doc.id }));
    return questions;
  }

  //ANCHOR - [static] getOne
  static async getOne(user: User, id: string): Promise<Question> {
    const snapshot = await getDoc(Quiz.doc(user.uid, id));
    const question = new Question({ ...snapshot.data(), id });
    return question;
  }

  //ANCHOR - [static] add
  static async add(
    user: User,
    courseparent: string,
    questionparent: string,
    title: string
  ): Promise<Question> {
    const quiz = await Quiz.getOne(user, questionparent);
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
//!SECTION

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

//SECTION - Lesson
export class Lesson extends PageDoc {
  id?: string;
  schedule: Schedule;
  parent: string;
  user: string;
  type: "lesson" = "lesson";
  sort: number;

  //ANCHOR - constructor
  constructor(
    data?: PageDocInitType &
      Partial<Pick<Lesson, "id" | "schedule" | "parent" | "sort">>
  ) {
    super(data);

    this.id = data?.id;
    this.schedule = new Schedule(data?.schedule);
    this.parent = data?.parent ?? "";
    this.user = data?.user ?? "";
    this.sort = data?.sort ?? Date.now();
  }

  //ANCHOR - val
  val(): ExcludeMethods<Lesson> {
    return Object.entries(this)
      .filter(
        ([key, value]) => value instanceof Function === false && key !== "id"
      )
      .reduce((data, [key, value]) => {
        return Object.assign(data, {
          [key]: value instanceof Schedule ? value.toJSON() : value,
        });
      }, {} as ExcludeMethods<Lesson>);
  }

  //ANCHOR - save
  async save() {
    if (this.id) {
      await updateDoc(Course.doc(this.user, this.id), {
        ...cleanObject(this.toJSON()),
        datemodified: serverTimestamp(),
        schedule: this.schedule.toJSON(),
      });
    }
  }

  //ANCHOR - [static] prefix
  private static prefix: string = `${process.env.REACT_APP_PREFIX}`;

  //ANCHOR - [static] getOne
  static async getOne(user: User, id: string): Promise<Lesson> {
    return new Lesson({
      ...(await getDoc(Course.doc(user.uid, id))).data(),
      id,
    });
  }

  //ANCHOR - [static] getLastSort
  static async getLastSort(user: User, courseId: string) {
    const snapshot = await getDocs(
      query(Course.collection(user.uid), where("parent", "==", courseId))
    );
    return (
      snapshot.docs
        .map((doc) => doc.data())
        .reduce((large, doc) => (large < doc?.sort ? doc.sort : large), 0) + 1
    );
  }

  //ANCHOR - [static] add
  static add(user: User, parent: string, title: string) {
    return new Promise<DocumentReference<DocumentData>>(
      async (resolve, reject) => {
        const lesson = new Lesson({ title, user: user.uid, parent });
        addDoc(Course.collection(user.uid), {
          ...lesson.val(),
          datecreate: serverTimestamp(),
          datemodified: serverTimestamp(),
        })
          .then(resolve)
          .catch(reject);
      }
    );
  }
}
//!SECTION

//SECTION - Assignment
export type AssignmentFile = { name: string; url: string };
export class Assignment {
  id: string;
  title: string;
  content: string;
  datedue: number;
  schedule: Schedule;
  files: AssignmentFile[];
  user: string;
  datecreate: number;
  datemodified: number;
  type: "assignment" = "assignment";
  parent: string;
  sort: number;

  constructor(data?: Partial<Assignment>) {
    this.id = data?.id ?? "";
    this.title = data?.title ?? "";
    this.content = data?.content ?? "";
    this.datedue = DateCtl.toNumber(data?.datedue);
    this.schedule = new Schedule(data?.schedule);
    this.files = data?.files ?? [];
    this.user = data?.user ?? "";
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.type = data?.type ?? "assignment";
    this.parent = data?.parent ?? "";
    this.sort = data?.sort ?? Date.now();
  }
  // static async getOne(assignmentId: string): Promise<AssignmentDocument> {
  //   const assignment = (
  //     await getDoc(this.doc("courses", assignmentId))
  //   ).data() as AssignmentDocument | null;
  //   if (!assignment) {
  //     throw new Error("Assignment not found.");
  //   }
  //   return assignment;
  // }
  // static async getMany(courseId: string) {
  //   const snapshot = await getDocs(
  //     query(
  //       this.collection("courses"),
  //       where("parent", "==", courseId),
  //       where("type", "==", "assignment")
  //     )
  //   );
  //   const docs = snapshot.docs.map((doc) =>
  //     this.parseDoc<AssignmentDocument>(doc)
  //   );
  //   return docs;
  // }
  // static async getSubmit(
  //   sectionId: string,
  //   assignmentId: string
  // ): Promise<SubmitDocument[]> {
  //   const docs = (
  //     await getDocs(
  //       query(
  //         this.collection("sections", sectionId, "submits"),
  //         where("parent", "==", assignmentId)
  //       )
  //     )
  //   ).docs.map((doc) => this.parseDoc<SubmitDocument>(doc));
  //   return docs;
  // }
  // static add(
  //   user: User,
  //   courseId: string,
  //   data: AssignmentDocumentOptions
  // ): Promise<DocumentReference<DocumentData>> {
  //   return new Promise(async (resolve, reject) => {
  //     const { rawFiles, ...newData } = data;
  //     const files = await Promise.all(
  //       (data?.rawFiles || []).map(
  //         async (file) =>
  //           await FileCtl.upload(user, file).catch((err) => {
  //             reject(err);
  //             return null;
  //           })
  //       )
  //     );
  //     const newFiles = files
  //       .filter((file) => file)
  //       .map((file) => ({
  //         name: file!.name,
  //         url: `${this.baseUrl()}/file/id/${file!._id}`,
  //       }));
  //     const sort = await Lesson.getLastSort(user, courseId);
  //     const result = await addDoc(this.collection("courses"), {
  //       ...cleanObject(newData),
  //       parent: courseId,
  //       sort,
  //       files: newFiles,
  //       user: user.uid,
  //       datecreate: dbTimestamp(),
  //       datemodified: dbTimestamp(),
  //       type: "assignment",
  //     });
  //     resolve(result);
  //   });
  // }
  // static async update(
  //   user: User,
  //   assignmentId: string,
  //   data: Material & { rawFiles?: File[] }
  // ) {
  //   const {
  //     user: us,
  //     id,
  //     sort,
  //     type,
  //     datecreate,
  //     parent,
  //     rawFiles,
  //     ...newData
  //   } = data;
  //   const files = await Promise.all(
  //     (rawFiles || []).map(async (file) => await FileCtl.upload(user, file))
  //   );
  //   const newFiles = files
  //     .filter((file) => file)
  //     .map((file) => ({
  //       name: file!.name,
  //       url: `${this.baseUrl()}/file/${file!._id}`,
  //     }));
  //   return updateDoc(this.doc("courses", assignmentId), {
  //     ...newData,
  //     files: (data.files || []).concat(...newFiles),
  //     schedule: newData.schedule.toJSON(),
  //     datemodified: dbTimestamp(),
  //   });
  // }

  // static async review(
  //   user: User,
  //   sectionId: string,
  //   assignmentId: string
  // ): Promise<{
  //   assignment: AssignmentDocument;
  //   section: SectionDocumentWithStudent;
  //   course: CourseDocument;
  //   submit: SubmitDocument[];
  // }> {
  //   const { role } = await TeachCtl.getRole(user);
  //   if (!(["owner", "teacher"] as Role[]).includes(role)) {
  //     throw new Error("Permission Denied");
  //   }

  //   const assignment = await this.getOne(assignmentId);
  //   const section = await SectionCtl.getOneWithStudent(sectionId);
  //   if (section === null) {
  //     throw new Error("Section not found");
  //   }

  //   const course = await CourseCtl.getOne(assignment.parent);
  //   if (course === null) {
  //     throw new Error("Course not found");
  //   }

  //   const submit = await this.getSubmit(sectionId, assignmentId);
  //   return { assignment, section, course, submit };
  // }

  // static async updateSubmitScore(
  //   sectionId: string,
  //   submitId: string,
  //   score: number
  // ) {
  //   await updateDoc(this.doc("sections", sectionId, "submits", submitId), {
  //     score,
  //   });
  // }

  // static send(
  //   user: User,
  //   data: AssignmentSubmitRawDataType,
  //   sectionId: string,
  //   assignmentId: string
  // ) {
  //   return new Promise(async (resolve) => {
  //     const files = (
  //       await Promise.all(data.files.map((file) => FileCtl.upload(user, file)))
  //     ).map((file) => ({
  //       name: file.name,
  //       url: `${this.baseUrl()}/file/id/${file._id}`,
  //     }));
  //     const info = await StudentCtl.info(user.uid).catch((err) => {
  //       throw new Error(err.message);
  //     });

  //     await addDoc(this.collection("sections", sectionId, "submits"), {
  //       parent: assignmentId,
  //       files,
  //       content: data.content,
  //       studentId: info.studentId,
  //       user: user.uid,
  //       date: dbTimestamp(),
  //     });
  //   });
  // }

  // static unsend(courseId: string, submitId: string) {
  //   return deleteDoc(this.doc("sections", courseId, "submits", submitId));
  // }
  // static status(
  //   user: User,
  //   sectionId: string,
  //   assignmentId: string,
  //   callback: (doc: AssignmentSubmitDocument | null) => void
  // ): Unsubscribe {
  //   return onSnapshot(
  //     query(
  //       this.collection("sections", sectionId, "submits"),
  //       where("user", "==", user.uid),
  //       where("parent", "==", assignmentId)
  //     ),
  //     (snapshot) => {
  //       const docs = snapshot.docs.map((doc) =>
  //         this.parseDoc<AssignmentSubmitDocument>(doc)
  //       );
  //       callback(docs.length ? docs[0] : null);
  //     }
  //   );
  // }
  // static isLated(duedate: string, timezone?: string, current?:number): boolean {
  //   const due = new Date(`${duedate}:00.000${timezone || "+07:00"}`).getTime();
  //   const now = current || new Date().getTime();
  //   return due < now;
  // }
  // static dueDisplay(duedate: string, timezone?: string): string {
  //   const due = new Date(`${duedate}:00.000${timezone || "+07:00"}`).getTime();
  //   return (
  //     moment(due).format("LLL") +
  //     (this.isLated(duedate, timezone) ? " - Lated" : "")
  //   );
  // }
}
//ANCHOR - AssignmentSubmit
export class AssignmentSubmit {
  id: string;
  date: number;
  type: "assignment-submit" = "assignment-submit";
  files: AssignmentFile[];
  message: string;
  content: string;
  user: string;
  score: number;
  parent: string;

  constructor(data?: Partial<AssignmentSubmit>) {
    this.id = data?.id ?? "";
    this.date = DateCtl.toNumber(data?.date);
    this.type = data?.type ?? "assignment-submit";
    this.files = data?.files ?? [];
    this.message = data?.message ?? "";
    this.content = data?.content ?? "";
    this.user = data?.user ?? "";
    this.score = data?.score ?? 0;
    this.parent = data?.parent ?? "";
  }
}
//!SECTION

//SECTION - Material
export type MaterialVal = ExcludeMethods<
  Omit<
    Material,
    | "id"
    | "init"
    | "schedule"
    | "rawFiles"
    | "path"
    | "feature"
    | "contents"
    | "maps"
  >
> & { schedule: ExcludeMethods<Schedule> };
export type MaterialField = keyof ExcludeMethods<Material>;
export class Material
  implements ExcludeMethods<Omit<PageDoc, "stamp" | "visibility">>
{
  id: string;
  title: string;
  parent: string;
  point: number;
  sort: number;
  user: string;
  type: "lesson" | "assignment" | "material-quiz";
  schedule: Schedule;
  datecreate: number;
  datemodified: number;

  // Lesson
  feature: PageDoc["feature"];
  contents: PageDoc["contents"];
  maps: PageDoc["maps"];

  // Quiz
  amount: number;
  attemps: number;
  quizId: string;

  // Assignment
  content: string;
  datedue: string;
  files: AssignmentFile[];

  weight: number;

  rawFiles: File[];
  path: string;

  //ANCHOR - constructor
  constructor(data?: Partial<Material> | Record<string, unknown>) {
    this.id = this.init.str(data?.id);
    this.title = this.init.str(data?.title);
    this.parent = this.init.str(data?.parent);
    this.point = this.init.num(data?.point);
    this.sort = this.init.num(data?.sort, Date.now());
    this.user = this.init.str(data?.user);
    this.type = ["lesson", "assignment", "material-quiz"].includes(
      `${data?.type}`
    )
      ? (data?.type as Material["type"])
      : "lesson";
    this.schedule = new Schedule(data?.schedule as Schedule);
    this.datecreate = DateCtl.toNumber(data?.datecreate);
    this.datemodified = DateCtl.toNumber(data?.datemodified);
    this.amount = this.init.num(data?.amount);
    this.attemps = this.init.num(data?.attemps, -1);
    this.quizId = this.init.str(data?.quizId);

    this.content = this.init.str(data?.content);
    this.datedue = this.init.str(data?.datedue, new Date().toString());
    this.files =
      data?.files && Array.isArray(data?.files)
        ? data.files
            .filter(
              (file): file is AssignmentFile =>
                typeof file === "object" && "name" in file && "url" in file
            )
            .map<AssignmentFile>((file) => ({ name: file.name, url: file.url }))
        : [];
    this.weight = this.init.num(data?.weight);

    this.rawFiles = this.init.files(data?.rawFiles);
    this.path = this.init.str(data?.path);

    this.feature = this.init.image(data?.feature);
    this.contents = this.init.contents(data?.contents);
    this.maps = this.init.maps(data?.maps);
  }

  //ANCHOR - init
  readonly init = {
    str: (data: unknown, fallback: string = ""): string =>
      typeof data === "string" ? data : fallback,
    num: (data: unknown, fallback: number = 0): number =>
      typeof data === "number"
        ? data
        : typeof data === "string"
        ? isNaN(parseFloat(data))
          ? parseFloat(data)
          : fallback
        : fallback,
    files: (data: unknown): File[] =>
      Array.isArray(data)
        ? data.filter((file): file is File => file instanceof File)
        : [],
    image: (data: unknown): PageDoc["feature"] => data ?? null,
    contents: (data: unknown): PageDoc["contents"] =>
      Array.isArray(data) ? data.map((doc) => doc as PageContentTypes) : [],
    maps: (data: unknown): PageDoc["maps"] =>
      Array.isArray(data) ? data.map<Map>((doc) => new Map(doc)) : [],
  };

  //ANCHOR - setQuiz
  setQuiz(data: Pick<this, "title" | "quizId" | "amount">): this {
    const { title, quizId, amount } = data;
    this.title = title;
    this.quizId = quizId;
    this.amount = amount;
    return this;
  }

  //ANCHOR - isComplete
  isComplete(type: Material["type"]): boolean {
    switch (type) {
      case "material-quiz":
        return Boolean(this.quizId && this.title);
      case "assignment":
        return Boolean(this.title && this.content && this.datedue);
      default:
        return false;
    }
  }

  //ANCHOR - set
  set<T extends MaterialField>(
    field: T,
    dispatch: ExcludeMethods<Material>[T] | ((data: this[T]) => this[T])
  ): Material {
    return new Material({
      ...this,
      [field]: dispatch instanceof Function ? dispatch(this[field]) : dispatch,
    });
  }

  //ANCHOR - val
  val(): MaterialVal {
    return Object.entries(this)
      .filter(
        ([key, value]) =>
          value instanceof Function === false &&
          [
            "id",
            "init",
            "rawFiles",
            "feature",
            "contents",
            "maps",
            "path",
          ].includes(key) === false
      )
      .reduce<MaterialVal>(
        (data, [key, value]) =>
          Object.assign(data, {
            [key]: key === "schedule" ? value.toJSON() : value,
          }),
        {
          title: "",
          parent: "",
          quizId: "",
          amount: 0,
          type: "lesson",
          point: 0,
          sort: Date.now(),
          user: "",
          schedule: new Schedule().toJSON(),
          datecreate: DateCtl.toNumber(),
          datemodified: DateCtl.toNumber(),
          attemps: -1,
          content: "",
          datedue: "",
          files: [],
          weight: 0,
        }
      );
  }

  //ANCHOR - toPageDoc
  toPageDoc(): PageDoc {
    const { title, user, datecreate, datemodified, feature, contents, maps } =
      this;
    const data = new PageDoc({
      title,
      user,
      datecreate,
      datemodified,
      feature,
      contents,
      maps,
      visibility: this.schedule.isPublic() ? "public" : "private",
    });
    return data;
  }

  //ANCHOR - save
  async save(user: User): Promise<Record<"id", string>> {
    let addedFiles = (
      await Promise.all(
        this.rawFiles.map(async (file) => await FileCtl.upload(user, file))
      )
    )
      .filter((file): file is FileDocument => Boolean(file))
      .map((file) => ({
        name: file!.name,
        url: `${MainStatic.baseUrl()}/file/${file!._id}`,
      }));

    if (this.id) {
      const { datecreate, datemodified, files, ...data } = this.val();
      await updateDoc(Course.doc(user.uid, this.id), {
        ...data,
        files: files.concat(addedFiles),
        datemodified: serverTimestamp(),
      });
      return { id: this.id };
    } else {
      const data = {
        ...this.val(),
        files: this.val().files.concat(addedFiles),
        user: user.uid,
        datecreate: serverTimestamp(),
        datemodified: serverTimestamp(),
      };
      const result = await addDoc(Course.collection(user.uid), data);
      return { id: result.id };
    }
  }

  //ANCHOR - remove
  async remove(user: User | null) {
    if (user) {
      await deleteDoc(Course.doc(user.uid, this.id));
    }
  }

  //ANCHOR - [static] watch
  static watch(
    user: User,
    parent: string,
    callback: (docs: Material[]) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        Course.collection(user.uid),
        where("type", "in", ["lesson", "assignment", "material-quiz"]),
        where("parent", "==", parent)
      ),
      (snapshot) => {
        const docs = snapshot.docs
          .map(
            (doc) =>
              new Material({ ...doc.data(), path: doc.ref.path, id: doc.id })
          )
          .sort((a, b) => a.datecreate - b.datecreate)
          .sort((a, b) => a.sort - b.sort);
        callback(docs);
      }
    );
  }

  //ANCHOR - Get
  static Get() {
    return {
      one: (uid: string, itemId: string) =>
        getDoc(doc(db, "users", uid, "documents", itemId)).then(
          (doc) => new Material({ ...doc.data(), id: doc.id })
        ),
      view: (uid: string, parent: string) => {
        return getDocs(
          query(Course.collection(uid), where("parent", "==", parent))
        ).then((snapshot) =>
          snapshot.docs
            .map(
              (doc) =>
                new Material({
                  ...doc.data(),
                  path: doc.ref.path,
                  id: doc.id,
                })
            )
            .filter((doc) => doc.schedule.isPublic())
            .sort((a, b) => a.sort - b.sort)
        );
      },
    };
  }

  //ANCHOR - lists
  static lists: Record<
    Material["type"],
    { label: LocaleKey; icon: PickIconName }
  > = {
    lesson: {
      label: "Lesson",
      icon: "chalkboard",
    },
    assignment: {
      label: "Assignment",
      icon: "file-alt",
    },
    "material-quiz": {
      label: "Quiz",
      icon: "list-ol",
    },
  };
}
//!SECTION
