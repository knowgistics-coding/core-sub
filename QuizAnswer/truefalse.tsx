import { Fragment } from "react";
import { useCore } from "../context";
import { useQD } from "./context";
import { ListButton } from "./list.button";

export const QDTrueFalse = () => {
  const { t } = useCore();
  const { quiz, answer } = useQD();

  return (
    <Fragment>
      <ListButton
        label={t(answer?.answer === "true" ? "True" : "False")}
        correct={answer?.check(quiz)}
      />
    </Fragment>
  );
};
