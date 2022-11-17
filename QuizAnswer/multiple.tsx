import { Fragment, useEffect, useState } from "react";
import { QuestionData } from "../Controller";
import { arrayShuffle } from "../func";
import { QDImgDisplay } from "../QuizEditor/img";
import { useQD } from "./context";
import { ListButton } from "./list.button";
import { QDParagraph } from "./paragraph";

export const QDMultiple = () => {
  const { answer, quiz } = useQD();
  const [options, setOptions] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (quiz.options) {
      const options = quiz.shuffle ? arrayShuffle(quiz.options) : quiz.options;
      setOptions(options);
    }
  }, [quiz]);

  return (
    <Fragment>
      {options.map((option) => {
        if (answer?.answer === option.key) {
          switch (option.type) {
            case "image":
              return (
                <ListButton
                  label={
                    option.image?._id ? (
                      <QDImgDisplay id={option.image._id} />
                    ) : null
                  }
                  correct={quiz.answer === option.key}
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
                  correct={quiz.answer === option.key}
                  key={option.key}
                />
              );
            default:
              return null;
          }
        }
        return null;
      })}
    </Fragment>
  );
};
