import { Panel } from "../panel";
import { MenuItem, Select } from "@mui/material";
import { useCore } from "../../context";
import { SelectChangeEvent } from "@mui/material";
import { useQEC } from "../context";

export const OptionsTrueFalse = () => {
  const { t } = useCore();
  const { open, data, setData, onTabOpen } = useQEC();

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    setData(data.set("answer", value));
  };

  return (
    <Panel
      expanded={open["answer"]}
      title={t("Answer")}
      onChange={onTabOpen("answer")}
    >
      <Select
        fullWidth
        variant="outlined"
        value={data?.answer || "true"}
        onChange={handleChange}
      >
        <MenuItem value={"true"}>{t("True")}</MenuItem>
        <MenuItem value={"false"}>{t("False")}</MenuItem>
      </Select>
    </Panel>
  );
};
