import { Fragment } from "react";
import { useCore } from "../context";
import { useQD } from "./context";
import { ListButton } from "./list.button";

export const QDTrueFalse = () => {
  const { t } = useCore();
  const { value, onChange } = useQD();

  const handleChange = (changeValue: string) => () =>
    onChange((answer) => answer.setAnswer(changeValue));

  return (
    <Fragment>
      <ListButton
        label={t("True")}
        selected={value?.answer === "true"}
        onClick={handleChange("true")}
      />
      <ListButton
        label={t("False")}
        selected={value?.answer === "false"}
        onClick={handleChange("false")}
      />
    </Fragment>
  );
};
