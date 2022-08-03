import { Fragment } from "react";
import update from "react-addons-update";
import { useCore } from "../context";
import { useQD } from "./context";
import { ListButton } from "./list.button";

export const QDTrueFalse = () => {
  const { t } = useCore();
  const { value, onChange } = useQD();

  const handleChange = (changeValue: string) => () => {
    onChange(
      update(value || { truefalse: "false" }, { truefalse: { $set: changeValue } })
    );
  };

  return (
    <Fragment>
      <ListButton
        label={t("True")}
        selected={value?.truefalse === "true"}
        onClick={handleChange("true")}
      />
      <ListButton
        label={t("False")}
        selected={value?.truefalse === "false"}
        onClick={handleChange("false")}
      />
    </Fragment>
  );
};
