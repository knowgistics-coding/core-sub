import { BoxProps } from "@mui/material";
import { createContext, useContext } from "react";
import { QuizDocument } from "../QuizEditor";

export interface QuizAnswerTypes {
  truefalse?: string;
  multiple?: number;
  matching?: { [key: number]: string };
  sorting?: number[];
}

export interface QuizDisplayProps {
  value?: QuizAnswerTypes;
  quiz: QuizDocument;
  onChange: (answer: QuizAnswerTypes) => void;
  containerProps?: BoxProps;
}

export interface QDContextTypes
  extends Pick<QuizDisplayProps, "quiz" | "onChange"> {
  value?: QuizAnswerTypes;
  onChange: (answer: QuizAnswerTypes) => void;
}
export const QDContext = createContext<QDContextTypes>({
  quiz: {},
  onChange: () => {},
});

export const useQD = () => useContext(QDContext);
