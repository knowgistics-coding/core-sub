import { Fragment, useEffect, useState } from "react";
import { QuestionData } from "../Controller";
import { arrayShuffle } from "../func";
import { QDImgDisplay } from "../QuizEditor/img";
import { useQD } from "./context";
import { ListButton } from "./list.button";
import { QDParagraph } from "./paragraph";

export const QDMultiple = () => {
  const { quiz, value, onChange } = useQD();
  const [options, setOptions] = useState<QuestionData[]>([]);

  const handleChange = (key: string) => () =>
    onChange((answer) => answer.setAnswer(key));

  useEffect(() => {
    if (quiz.options) {
      const options = quiz.shuffle ? arrayShuffle(quiz.options) : quiz.options;
      setOptions(options);
    }
  }, [quiz]);

  return (
    <Fragment>
      {options.map((option) => {
        switch (option.type) {
          case "image":
            return (
              <ListButton
                label={
                  option.image?._id ? (
                    <QDImgDisplay id={option.image._id} />
                  ) : null
                }
                onClick={handleChange(option.key)}
                selected={value?.answer === option.key}
                key={option.key}
              />
            );
          case "paragraph":
            return (
              <ListButton
                label={
                  option?.paragraph ? (
                    <QDParagraph value={option?.paragraph} />
                  ) : null
                }
                onClick={handleChange(option.key)}
                selected={value?.answer === option.key}
                key={option.key}
              />
            );
          default:
            return null;
        }
      })}
    </Fragment>
  );
};
