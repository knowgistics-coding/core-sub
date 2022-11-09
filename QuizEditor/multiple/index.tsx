import React, { Fragment } from "react";
import {
  Box,
  Button,
  styled,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Panel } from "../panel";
import { SelectType } from "../select.type";
import { useQEC } from "../context";
import { useCore } from "../../context";
import { KuiButton } from "../../KuiButton";
import { usePopup } from "../../Popup";
import { QuestionData } from "components/core-sub/Controller";

const AnswerBox = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  "&:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

export const OptionsMultiple = () => {
  const { t } = useCore();
  const { open, data, setData, onTabOpen } = useQEC();
  const { Popup } = usePopup();

  const handleChangeOption =
    (index: number) => (value: Omit<QuestionData, "key">) => {
      setData(data.setOption(index, value));
    };
  const handleAddOption = () => setData(data.addOption());
  const handleDelete = (key: string) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Choice") }),
      icon: "trash",
      onConfirm: () => {
        setData(data.removeOption(key));
      },
    });
  };
  const handleChangeShuffle = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setData(data.set("shuffle", checked));
  };

  return (
    <Panel
      expanded={open["answer"]}
      title={t("Choice")}
      actions={
        <Fragment>
          <FormControlLabel
            label={t("Shuffle")}
            control={
              <Checkbox
                checked={Boolean(data.shuffle)}
                onChange={handleChangeShuffle}
              />
            }
            componentsProps={{
              typography: { variant: "body2", color: "textSecondary" },
            }}
          />
          <Button color="primary" onClick={handleAddOption}>
            {t("Add Choice")}
          </Button>
        </Fragment>
      }
      onChange={onTabOpen("choice")}
    >
      {data.options.map((item, index, options) => (
        <AnswerBox key={item.key}>
          <SelectType
            type={item.type}
            image={item.image}
            paragraph={item.paragraph}
            onChange={handleChangeOption(index)}
            title={t(`Choice`) + ` ${index + 1}`}
          />
          {Boolean(options.length > 0) && (
            <Stack
              direction={"row"}
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                label={t("Right Answer")}
                control={
                  <Checkbox
                    size="small"
                    checked={item.key === data.answer}
                    onChange={() => setData(data.set("answer", item.key))}
                  />
                }
                componentsProps={{
                  typography: { variant: "body2", color: "textSecondary" },
                }}
              />
              {Boolean(options.length > 2) && (
                <KuiButton
                  variant="outlined"
                  size="small"
                  tx="remove"
                  onClick={handleDelete(item.key)}
                />
              )}
            </Stack>
          )}
        </AnswerBox>
      ))}
    </Panel>
  );
};
