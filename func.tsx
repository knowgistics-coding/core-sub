import { Timestamp } from "firebase/firestore";

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

export const cleanObject = <T extends unknown>(data: T): T | null => {
  if (Array.isArray(data)) {
    return data.map((item) => cleanObject(item)) as T;
  } else if (data instanceof Date) {
    return data;
  } else if (data instanceof Timestamp) {
    return data
  } else if (data === null) {
    return null
  } else if (typeof data === "object") {
    let newData = Object.assign({}, data) as Record<string, unknown>;
    Object.entries(newData as Object).forEach(([key, value]) => {
      if (typeof value === "undefined") {
        delete newData[key];
      } else {
        newData[key] = cleanObject(value);
      }
    });
    return newData as T;
  } else if (typeof data === "undefined") {
    return null;
  } else {
    return data;
  }
};

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

export const simpleHash = (text: string): string => {
  const hash = text
    .split("")
    .map((letter) => (letter.charCodeAt(0) - 30).toString(16))
    .join("");
  return hash
};
