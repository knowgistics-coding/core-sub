import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { StockDisplayImageTypes } from "../StockDisplay";

export const genKey = () => Math.floor(Math.random() * 1000000);

interface openTypes {
  [key: string]: boolean;
}

export type TypeTypes = "paragraph" | "image";
export type dataTypes = {
  key: number;
  type: "paragraph" | "image";
  paragraph?: string;
  image?: StockDisplayImageTypes;
};
export type QuizDocument = {
  id?: string;
  type?: "truefalse" | "matching" | "sorting" | "multiple";
  question?: Omit<dataTypes, "key">;
  truefalse?: {
    answer: string;
  };
  matching?: {
    options: (dataTypes & { value?: string })[];
  };
  sorting?: {
    options: dataTypes[];
    answers: number[];
  };
  multiple?: {
    options: dataTypes[];
    answer: number;
  };
  shuffle?: boolean;
};

export interface QuizEditorContextTypes {
  genKey: () => number;
  open: openTypes;
  setOpen: Dispatch<SetStateAction<openTypes>>;
  data: QuizDocument;
  setData: Dispatch<SetStateAction<QuizDocument>>;
  onTabOpen: (
    key: string
  ) => (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void;
}
export const QuizEditorContext = createContext<QuizEditorContextTypes>({
  genKey,
  open: {},
  setOpen: () => {},
  data: {
    type: "multiple",
    question: {
      type: "paragraph",
    },
  },
  setData: () => {},
  onTabOpen: () => () => {},
});
export const useQEC = () => useContext(QuizEditorContext);
