import { db } from "controllers/firebase";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { cleanObject } from "../func";

export class LMSAccount {
  email: string;

  thaiName: string;
  thtitle: string;
  thfirstname: string;
  thmiddlename: string;
  thlastname: string;

  engName: string;
  entitle: string;
  enfirstname: string;
  enmiddlename: string;
  enlastname: string;

  gender: string;
  group?: string;
  groupStudentId?: string;
  studentId: string;

  occupation: string;
  institute: "school" | "university" | "others";
  institutename: string;
  jobtitle: string;
  workplace: string;
  telephone?: string;
  lineid?: string;

  constructor(data: Partial<LMSAccount> & Pick<LMSAccount, "email">) {
    this.email = data.email || "";

    this.thaiName = data.thaiName || "";
    this.thtitle = data.thtitle || "";
    this.thfirstname = data.thfirstname || "";
    this.thmiddlename = data.thmiddlename || "";
    this.thlastname = data.thlastname || "";

    this.engName = data.engName || "";
    this.entitle = data.entitle || "";
    this.enfirstname = data.enfirstname || "";
    this.enmiddlename = data.enmiddlename || "";
    this.enlastname = data.enlastname || "";

    this.gender = data.gender || "";
    this.group = data.group || "";
    this.groupStudentId = data.groupStudentId || "";
    this.studentId = data.studentId || "";

    this.occupation = data.occupation || "";
    this.institute = data.institute || "others";
    this.institutename = data.institutename || "";
    this.jobtitle = data.jobtitle || "";
    this.workplace = data.workplace || "";
    this.telephone = data.telephone;
    this.lineid = data.lineid;
  }

  isJobComplete(): boolean {
    if (this.occupation === "student") {
      return Boolean(this.institute && this.institutename);
    } else if (this.occupation === "teacher") {
      return Boolean(this.institute && this.institutename);
    } else {
      return Boolean(this.workplace && this.jobtitle);
    }
  }

  isNameComplete(): boolean {
    return (
      this.isJobComplete() &&
      (Boolean(this.thtitle && this.thfirstname && this.thlastname) ||
        Boolean(this.entitle && this.enfirstname && this.enlastname))
    );
  }

  isComplete(): boolean {
    return this.isNameComplete() && Boolean(this.email && this.studentId);
  }

  update<Key extends keyof this>(field: Key, value: this[Key]): this {
    this[field] = value;
    return this;
  }

  toStudent(): Pick<
    LMSAccount,
    | "email"
    | "enfirstname"
    | "engName"
    | "enlastname"
    | "enmiddlename"
    | "entitle"
    | "gender"
    | "studentId"
    | "thaiName"
    | "thfirstname"
    | "thlastname"
    | "thmiddlename"
    | "thtitle"
  > {
    const {
      email,
      enfirstname,
      engName,
      enlastname,
      enmiddlename,
      entitle,
      gender,
      studentId,
      thaiName,
      thfirstname,
      thlastname,
      thmiddlename,
      thtitle,
    } = this;
    return {
      email,
      enfirstname,
      engName,
      enlastname,
      enmiddlename,
      entitle,
      gender,
      studentId,
      thaiName,
      thfirstname,
      thlastname,
      thmiddlename,
      thtitle,
    };
  }

  toUser(): Pick<
    LMSAccount,
    | "occupation"
    | "institute"
    | "institutename"
    | "jobtitle"
    | "workplace"
    | "thtitle"
    | "thfirstname"
    | "thmiddlename"
    | "thlastname"
    | "entitle"
    | "enfirstname"
    | "enmiddlename"
    | "enlastname"
    | "telephone"
    | "email"
    | "lineid"
  > {
    const {
      occupation,
      institute,
      institutename,
      jobtitle,
      workplace,
      thtitle,
      thfirstname,
      thmiddlename,
      thlastname,
      entitle,
      enfirstname,
      enmiddlename,
      enlastname,
      telephone,
      email,
      lineid,
    } = this;
    return {
      occupation,
      institute,
      institutename,
      jobtitle,
      workplace,
      thtitle,
      thfirstname,
      thmiddlename,
      thlastname,
      entitle,
      enfirstname,
      enmiddlename,
      enlastname,
      telephone,
      email,
      lineid,
    };
  }

  async save(user?: User) {
    if (this.isComplete() && this.studentId) {
      const studentRef = doc(
        db,
        "lms",
        LMSAccount.prefix,
        "students",
        this.studentId
      );
      await setDoc(studentRef, cleanObject(this.toStudent()), { merge: true });

      if (user) {
        const userRef = doc(db, "lms", LMSAccount.prefix, "users", user.uid);
        await setDoc(userRef, cleanObject(this.toUser()), { merge: true });
      }
    }
  }

  private static prefix: string = `${process.env.REACT_APP_PREFIX}`;
  static async get(user: User): Promise<LMSAccount | null> {
    const student = await getDocs(
      query(
        collection(db, "lms", this.prefix, "students"),
        where("email", "==", user.email)
      )
    );
    const userinfo = await getDoc(
      doc(db, "lms", this.prefix, "users", user.uid)
    );
    const account = new LMSAccount({
      email: user.email!,
      ...(student.docs.length > 0 ? student.docs[0].data() : {}),
      ...(userinfo.exists() ? userinfo.data() : {}),
    });
    return account;
  }
}
