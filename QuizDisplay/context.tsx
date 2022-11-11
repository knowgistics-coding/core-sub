import { BoxProps } from "@mui/material";
import { createContext, useContext } from "react";
import { Question, QuestionAnswer } from "../Controller";

export interface QuizDisplayProps {
  value?: QuestionAnswer;
  quiz: Question;
  onChange: (func: (answer: QuestionAnswer) => QuestionAnswer) => void;
  containerProps?: BoxProps;
}

export interface QDContextTypes
  extends Pick<QuizDisplayProps, "quiz" | "onChange"> {
  value?: QuestionAnswer;
}
export const QDContext = createContext<QDContextTypes>({
  quiz: new Question(),
  onChange: () => {},
});

export const useQD = () => useContext(QDContext);
