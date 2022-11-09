import React, { useState } from "react";
import { QuizEditorContextTypes, QuizEditorContext, genKey } from "./context";

import { QuestionType } from "./question.type";
import { OptionsMultiple } from "./multiple";
import { OptionsTrueFalse } from "./truefalse";
import { OptionsMatching } from "./matching";
import { OptionsSorting } from "./sorting";
import { Question as BoxQuestion } from "./question";
import { Question } from "../Controller";

export * from "./context";

export interface QuizEditorProps {
  data: Question;
  setData: (data: Question) => void;
}
export const QuizEditor = ({ data, setData }: QuizEditorProps) => {
  const [open, setOpen] = useState<QuizEditorContextTypes["open"]>({
    type: true,
    question: true,
    answer: true,
  });

  const onTabOpen =
    (key: string) =>
    (_event: React.SyntheticEvent<Element, Event>, expanded: boolean) =>
      setOpen((s) => ({ ...s, [key]: expanded }));

  return (
    <QuizEditorContext.Provider
      value={{
        genKey,
        open,
        setOpen,
        data,
        setData,
        onTabOpen,
      }}
    >
      <QuestionType />
      {data.type && <BoxQuestion />}
      {data.type === "multiple" && <OptionsMultiple />}
      {data.type === "truefalse" && <OptionsTrueFalse />}
      {data.type === "matching" && <OptionsMatching />}
      {data.type === "sorting" && <OptionsSorting />}
    </QuizEditorContext.Provider>
  );
};
