import { Panel } from "./panel";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { QuizDocument, useQEC } from "./context";
import { Fragment } from "react";
import { useCore } from "../context";
import { LocaleKey } from "../Translate/en_th";

const lists: { label: LocaleKey; value: string }[] = [
  { label: "Multiple Choice", value: "multiple" },
  { label: "True / False", value: "truefalse" },
  { label: "Matching", value: "matching" },
  { label: "Sorting", value: "sorting" },
];

export const QuestionType = () => {
  const { t } = useCore();
  const { open, data, setData, onTabOpen } = useQEC();

  const handleChangeType = ({
    target: { value },
  }: SelectChangeEvent<string>) => {
    const type = value as QuizDocument["type"];
    setData({ type });
  };

  const getLabel = (): LocaleKey =>
    lists.find((item) => item.value === data.type)?.label ?? "Multiple Choice";

  return (
    <Panel
      expanded={open["type"] || !Boolean(data.type)}
      onChange={onTabOpen("type")}
      title={
        <Fragment>
          {t("Question Type")}
          {data.type && ` (${t(getLabel())})`}
        </Fragment>
      }
    >
      <FormControl fullWidth variant="outlined">
        <InputLabel id="question-type-label">{t("Question Type")}</InputLabel>
        <Select
          label={t("Question Type")}
          labelId="question-type-label"
          value={
            lists.map((l) => l.value).includes(data?.type || "")
              ? data.type
              : ""
          }
          onChange={handleChangeType}
        >
          <MenuItem value="" disabled>
            -- {t("Question Type")} --
          </MenuItem>
          {lists.map((list) => (
            <MenuItem value={list.value} key={list.value}>
              {t(`${list.label}`)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Panel>
  );
};
