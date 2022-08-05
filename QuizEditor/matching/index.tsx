import { ChangeEvent, useEffect } from "react";
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
import update from "react-addons-update";
import { KuiButton } from "../../KuiButton";
import { usePopup } from "components/core-sub/react-popup";

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
  const { open, data, setData, onTabOpen, genKey } = useQEC();
  const { Popup } = usePopup();

  const handleOptionChange =
    (index: number) => (data: Omit<dataTypes, "key">) => {
      setData((d) => {
        const newValue = Object.assign({}, d.matching?.options?.[index], data);
        return update(d, {
          matching: { options: { [index]: { $set: newValue } } },
        });
      });
    };
  const handleChange =
    (index: number) =>
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setData((d) =>
        update(d, {
          matching: { options: { [index]: { value: { $set: value } } } },
        })
      );
  const handleAdd = () => {
    if (data?.matching?.options) {
      const options: dataTypes[] = data?.matching?.options.concat({
        key: genKey(),
        type: "paragraph",
      });
      setData((d) => update(d, { matching: { options: { $set: options } } }));
    }
  };
  const handleRemove = (key: number) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("DoYouWantToRemove", { name: t("Choice") }),
      icon: "trash",
      onConfirm: () => {
        if (data.matching?.options) {
          const options = data.matching.options.filter(
            (opt) => opt.key !== key
          );
          setData((d) =>
            update(d, { matching: { options: { $set: options } } })
          );
        }
      },
    });
  };

  useEffect(() => {
    if (!data?.matching?.options || data?.matching?.options?.length < 1) {
      const options: dataTypes[] = Array.from(Array(2).keys()).map(() => ({
        key: genKey(),
        type: "paragraph",
      }));
      setData((d) => update(d, { matching: { $set: { options } } }));
    }
  }, [data?.matching?.options, genKey, setData]);

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
      {data.matching?.options.map((option, index) => (
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
            {(data?.matching?.options?.length || 0) > 2 && (
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
