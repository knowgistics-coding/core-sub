import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Question } from "../Controller";

export const genKey = () => Math.floor(Math.random() * 1000000);

interface openTypes {
  [key: string]: boolean;
}

export interface QuizEditorContextTypes {
  genKey: () => number;
  open: openTypes;
  setOpen: Dispatch<SetStateAction<openTypes>>;
  data: Question;
  setData: (data: Question) => void;
  onTabOpen: (
    key: string
  ) => (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void;
}
export const QuizEditorContext = createContext<QuizEditorContextTypes>({
  genKey,
  open: {},
  setOpen: () => {},
  data: new Question(),
  setData: () => {},
  onTabOpen: () => () => {},
});
export const useQEC = () => useContext(QuizEditorContext);
