import draftToHtml from "draftjs-to-html";
import { Timestamp } from "firebase/firestore";
import { QuizAnswerTypes } from "./QuizDisplay";
import { QuizDocument } from "./QuizEditor";
import { dataTypes } from "./QuizEditor/context";
import { StockDisplayImageTypes } from "./StockDisplay";
import { StockImageTypes } from "./StockPicker";

export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const browserDetect = () => {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/line/i)) {
    browserName = "line";
  } else if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "No browser detection";
  }

  return browserName;
};

type dataObject = { [key: string]: any };
export function cleanObject<T>(data: T | T[]): T | T[] | null {
  if (data) {
    if (Array.isArray(data)) {
      return data.map((d: any) => cleanObject(d));
    } else if (typeof data === "object") {
      const newData: dataObject = data;
      Object.keys(newData).forEach((key) => {
        if (typeof newData[key] === "undefined") {
          delete newData[key];
        } else {
          newData[key] = cleanObject(newData[key]);
        }
      });
      return newData as T;
    } else {
      return data;
    }
  } else {
    return null;
  }
}

export function arrayShuffle<T>(oldArray: T[]): T[] {
  const array = oldArray.slice();
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const quizConvertGetImage = (
  id: string
): Promise<StockDisplayImageTypes | undefined> => {
  return new Promise(async (res) => {
    const result = await fetch(`https://s1.phra.in:8086/file/ref/${id}`)
      .then((res) => res.json())
      .catch((err) => {
        console.log(err);
        res(undefined);
      });
    if (result) {
      const { _id, blurhash, width, height } = result as StockImageTypes;
      const image: StockDisplayImageTypes = {
        _id,
        blurhash,
        width,
        height,
      };
      res(image);
    } else {
      res(undefined);
    }
  });
};
export const quizConvert = async (data: any): Promise<QuizDocument> => {
  if (Boolean(data?.[data?.type])) {
    return data;
  }

  let question: QuizDocument["question"] = {
    type: data?.qtype || "paragraph",
  };
  if (data?.qtype !== "image") {
    const htmlstring = draftToHtml(data.question);
    if (typeof htmlstring === "string") {
      question.paragraph = htmlstring;
    }
  } else if (typeof data?.question?.id === "string") {
    question.image = await quizConvertGetImage(data.question.id);
  }

  let doc: QuizDocument = {
    question,
    type: data?.type,
  };

  if (doc.type === "multiple") {
    doc.multiple = {
      options: await Promise.all(
        data.options.map(
          async (d: any) =>
            ({
              key: d.key,
              type: d.type,
              paragraph:
                d.type === "paragraph" ? draftToHtml(d.value) : undefined,
              image: d?.data?.id
                ? await quizConvertGetImage(d?.data?.id)
                : undefined,
            } as dataTypes)
        )
      ),
      answer: data.answer,
    };
  } else if (doc.type === "matching") {
    doc.matching = {
      options: await Promise.all(
        data?.answers?.map(
          async (answer: any): Promise<dataTypes & { value?: string }> => ({
            value: answer.value,
            key: answer.key,
            type: answer.type,
            paragraph:
              answer.type !== "image" ? draftToHtml(answer.label) : undefined,
            image:
              answer.type === "image"
                ? await quizConvertGetImage(answer.data.id)
                : undefined,
          })
        ) || []
      ),
    };
  } else if (doc.type === "truefalse") {
    doc.truefalse = {
      answer: `${data.answers}`,
    };
  } else if (doc.type === "sorting") {
    doc.sorting = {
      options: await Promise.all(
        data.options.map(
          async (option: any): Promise<dataTypes> => ({
            key: option.key,
            type: option.type,
            paragraph:
              option.type !== "image" ? draftToHtml(option.value) : undefined,
            image:
              option.type === "image"
                ? await quizConvertGetImage(option.data.id)
                : undefined,
          })
        )
      ),
      answers: data.answers,
    };
  }
  return doc;
};

export const quizAnswerCheck = (
  data: QuizDocument,
  answer: QuizAnswerTypes
): boolean => {
  if (
    data.type === "truefalse" &&
    data.truefalse?.answer !== undefined &&
    answer?.truefalse
  ) {
    return data.truefalse.answer === answer.truefalse;
  } else if (
    data.type === "multiple" &&
    data.multiple?.answer !== undefined &&
    answer?.multiple
  ) {
    return data.multiple.answer === answer.multiple;
  } else if (
    data.type === "matching" &&
    data.matching?.options &&
    answer?.matching
  ) {
    const result = data.matching.options.every((option) => {
      return answer.matching?.[option.key] === option.value;
    });
    return result;
  } else if (
    data.type === "sorting" &&
    data.sorting?.answers &&
    answer?.sorting
  ) {
    return data.sorting.answers.every(
      (key, index) => key === answer.sorting?.[index]
    );
  }
  return false;
};

export const coverToStock = (id: string, prefix?: string) => {
  return new Promise((resolved, reject) => {
    const url = prefix
      ? `https://s1.phra.in:8086/file/ref/${prefix}/${id}`
      : `https://s1.phra.in:8086/file/ref/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((res) => resolved(res))
      .catch((err) => reject(err));
  });
};

export const timestampToDate = (inputDate: Timestamp): Date => {
  if (inputDate?.toMillis?.()) {
    const newDate = new Date(0);
    newDate.setMilliseconds(inputDate.toMillis());
    return newDate;
  }
  return new Date();
};

export const darkModeListener = (callback: (isDarkMode: boolean) => void) => {
  const elem = window.matchMedia("(prefers-color-scheme: dark)");
  callback(elem.matches);
  elem.addEventListener("change", (event) => {
    callback(event.matches);
  });
  return () => elem.removeEventListener("change", () => {});
};

export const SpliceImmutable = <T extends unknown>(
  docs: T[],
  start: number,
  deleteCount?: number
): T[] => {
  let newDocs = [...docs];
  newDocs.splice(start, deleteCount);
  return newDocs;
};
