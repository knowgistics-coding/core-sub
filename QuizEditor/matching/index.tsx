import { ChangeEvent } from "react";
import { dataTypes, useQEC } from "../context";
import { Panel } from "../panel";
import {
  Box,
  Button,
  styled,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { useCore } from "../../context";
import { SelectType } from "../select.type";
import { KuiButton } from "../../KuiButton";
import { usePopup } from "../../Popup";

const AnswerBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `solid 1px ${theme.palette.grey[300]}`,
  "&:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

const Label = styled((props: TypographyProps) => (
  <Typography variant="body1" {...props} />
))({
  fontWeight: "bold",
});

export const OptionsMatching = () => {
  const { t } = useCore();
  const { open, data, setData, onTabOpen } = useQEC();
  const { Popup } = usePopup();

  const handleOptionChange =
    (index: number) => (option: Omit<dataTypes, "key">) =>
      setData(data.setOption(index, option));
  const handleChange =
    (index: number) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setData(data.setOption(index, { value }));
  const handleAdd = () => setData(data.addOption());
  const handleRemove = (key: string) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Choice") }),
      icon: "trash",
      onConfirm: () => setData(data.removeOption(key)),
    });
  };

  return (
    <Panel
      expanded={open["answer"]}
      onChange={onTabOpen("answer")}
      title={t("Answer")}
      actions={
        <Button color="primary" onClick={handleAdd}>
          {t("Add Matching")}
        </Button>
      }
    >
      {data.options.map((option, index) => (
        <AnswerBox key={option.key}>
          <SelectType
            type={option.type}
            image={option.image}
            paragraph={option.paragraph}
            title={t("Sub Question") + ` ${index + 1}`}
            onChange={handleOptionChange(index)}
          />
          <Box pt={2} />
          <Label paragraph>{t("Answer") + ` ` + (index + 1)}</Label>
          <TextField
            fullWidth
            label={t("Answer Text")}
            variant="outlined"
            value={option.value}
            onChange={handleChange(index)}
          />
          <Box display="flex" justifyContent={"space-between"} mt={2}>
            <Box flex={1} />
            {(data.options?.length ?? 0) > 2 && (
              <KuiButton
                variant="outlined"
                size="small"
                tx="remove"
                onClick={handleRemove(option.key)}
              />
            )}
          </Box>
        </AnswerBox>
      ))}
    </Panel>
  );
};
