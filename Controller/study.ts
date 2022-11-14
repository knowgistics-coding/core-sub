import { MainStatic } from "./main.static";
import { User } from "firebase/auth";
import { Quiz, Question } from "./course";
import {
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { DateCtl } from "./date.ctl";

export class Study extends MainStatic {}

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

export class StudyQuiz extends MainStatic {
  quiz: Quiz;
  questions: Question[];
  attemps: Score[];

  constructor(data?: Partial<StudyQuiz>) {
    super();

    this.quiz = new Quiz(data?.quiz);
    this.questions = (data?.questions ?? []).map(
      (question) => new Question({ ...question })
    );
    this.attemps = data?.attemps ?? [];
  }

  set<T extends keyof this>(field: T, value: this[T]): this {
    this[field] = value;
    return this;
  }

  quizable(): boolean {
    if (parseInt(`${this.quiz.attemps}`) === -1) {
      return true;
    } else if (parseInt(`${this.quiz.attemps}`) > this.attemps.length) {
      return true;
    } else {
      return false;
    }
  }

  protected static collection(path: string, ...pathSegments: string[]) {
    return collection(db, "lms", `${this.prefix}`, path, ...pathSegments);
  }
  protected static doc(path: string, ...pathSegments: string[]) {
    return doc(db, "lms", `${this.prefix}`, path, ...pathSegments);
  }

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

  static watch(
    user: User,
    sectionId: string,
    quizId: string,
    callback: (data: StudyQuiz) => void
  ): Unsubscribe {
    return onSnapshot(
      query(
        this.collection("sections", sectionId, `scores`),
        where("user", "==", user.uid),
        where("quizId", "==", quizId)
      ),
      async (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) => new Score({ ...doc.data(), id: doc.id })
        );
        const quiz = await this.getQuiz(user, sectionId, quizId);
        callback(quiz.set("attemps", docs));
      }
    );
  }
}
