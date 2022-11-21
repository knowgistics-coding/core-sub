//SECTION - IMPORT
import { MainStatic } from "./main.static";
import { User } from "firebase/auth";
import { Quiz, Question, QuestionAnswer } from "./course";
import {
  collection,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { DateCtl } from "./date.ctl";
//!SECTION

//SECTION - CLASS: Study
export class Study extends MainStatic {}
//!SECTION

//SECTION - CLASS: Score
export class Score {
  id: string;
  date: number;
  amount: number;
  point: number;
  score: number;
  quizId: string;
  studentId: string;
  type: "quiz" = "quiz";
  user: string;

  constructor(
    data?: Partial<Omit<Score, "date"> & { date: Timestamp | Date | number }>
  ) {
    this.id = data?.id ?? "";
    this.date = DateCtl.toNumber(data?.date);
    this.amount = parseInt(String(data?.amount ?? 0));
    this.point = parseInt(String(data?.point ?? 0));
    this.score = parseInt(String(data?.score));
    this.quizId = data?.quizId ?? "";
    this.studentId = data?.studentId ?? "";
    this.user = data?.user ?? "";
  }
}
//!SECTION

/**
 *  $$$$$$\ $$$$$$$$\ $$\   $$\ $$$$$$$\ $$\     $$\
 * $$  __$$\\__$$  __|$$ |  $$ |$$  __$$\\$$\   $$  |
 * $$ /  \__|  $$ |   $$ |  $$ |$$ |  $$ |\$$\ $$  /
 * \$$$$$$\    $$ |   $$ |  $$ |$$ |  $$ | \$$$$  /
 *  \____$$\   $$ |   $$ |  $$ |$$ |  $$ |  \$$  /
 * $$\   $$ |  $$ |   $$ |  $$ |$$ |  $$ |   $$ |
 * \$$$$$$  |  $$ |   \$$$$$$  |$$$$$$$  |   $$ |
 *  \______/   \__|    \______/ \_______/    \__|
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

//SECTION - StudyQuiz
export class StudyQuiz extends MainStatic {
  quiz: Quiz;
  questions: Question[];
  attemps: Score[];

  //ANCHOR - constructor
  constructor(data?: Partial<StudyQuiz>) {
    super();

    this.quiz = new Quiz(data?.quiz);
    this.questions = (data?.questions ?? []).map(
      (question) => new Question({ ...question })
    );
    this.attemps = data?.attemps ?? [];
  }

  //ANCHOR - set
  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  //ANCHOR - quizable
  quizable(): boolean {
    if (parseInt(`${this.quiz.attemps}`) === -1) {
      return true;
    } else if (parseInt(`${this.quiz.attemps}`) > this.attemps.length) {
      return true;
    } else {
      return false;
    }
  }

  static async submit(
    user: User,
    sectionId: string,
    quizId: string,
    answers: Record<string, QuestionAnswer>,
    ids: string[]
  ): Promise<Score> {
    const result = await this.get<Score>(
      user,
      `${this.baseUrl()}/student/quiz/submit`,
      "PUT",
      JSON.stringify({
        prefix: this.prefix,
        sectionId,
        quizId,
        answers,
        questions: ids,
      })
    );
    return result;
  }

  //SECTION - STATIC

  //ANCHOR - collection
  protected static collection(path: string, ...pathSegments: string[]) {
    return collection(db, "lms", `${this.prefix}`, path, ...pathSegments);
  }

  //ANCHOR - doc
  protected static doc(path: string, ...pathSegments: string[]) {
    return doc(db, "lms", `${this.prefix}`, path, ...pathSegments);
  }

  //ANCHOR - getQuiz
  private static getQuiz(
    user: User,
    sectionId: string,
    quizId: string
  ): Promise<StudyQuiz> {
    return new Promise(async (resolve, reject) => {
      this.get<StudyQuiz>(
        user,
        `${this.baseUrl()}/student/quiz/`,
        "POST",
        JSON.stringify({
          section: sectionId,
          quiz: quizId,
          prefix: this.prefix,
        })
      )
        .then(async (data) => {
          resolve(new StudyQuiz(data));
        })
        .catch((err) => reject(err));
    });
  }

  //ANCHOR - getScores
  static async getScores(
    user: User,
    sectionId: string,
    quizId: string
  ): Promise<Score[]> {
    const snapshot = await getDocs(
      query(
        this.collection("sections", sectionId, `scores`),
        where("user", "==", user.uid),
        where("quizId", "==", quizId)
      )
    );
    const docs = snapshot.docs.map(
      (doc) => new Score({ ...doc.data(), id: doc.id })
    );
    return docs;
  }

  //ANCHOR - watch
  static async getOne(
    user: User,
    sectionId: string,
    quizId: string
  ): Promise<StudyQuiz> {
    const quiz = await this.getQuiz(user, sectionId, quizId);
    const scores = await this.getScores(user, sectionId, quizId);
    return quiz.set("attemps", scores);
  }

  //!SECTION
}
//!SECTION
