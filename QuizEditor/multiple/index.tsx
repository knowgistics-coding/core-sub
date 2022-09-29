import React, { Fragment, useEffect } from "react";
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
import { dataTypes, useQEC } from "../context";
import update from "react-addons-update";
import { useCore } from "../../context";
import { KuiButton } from "../../KuiButton";
import { usePopup } from "../../Popup";

const AnswerBox = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  "&:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

export const OptionsMultiple = () => {
  const { t } = useCore();
  const { genKey, open, data, setData, onTabOpen } = useQEC();
  const { Popup } = usePopup();

  const handleChangeOption =
    (index: number, key: number) => (value: Omit<dataTypes, "key">) => {
      setData((d) =>
        update(d, {
          multiple: { options: { [index]: { $set: { ...value, key } } } },
        })
      );
    };
  const handleAddOption = () => {
    if (data?.multiple?.options?.length) {
      const options = data?.multiple?.options.concat({
        key: genKey(),
        type: "paragraph",
      });
      setData((d) =>
        update(d, {
          multiple: {
            options: { $set: options },
          },
        })
      );
    }
  };
  const handleDelete = (key: number) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Choice") }),
      icon: "trash",
      onConfirm: () => {
        if (data?.multiple?.options) {
          const options = data?.multiple?.options.filter(
            (option) => option.key !== key
          );
          setData((d) =>
            update(d, {
              multiple: {
                options: { $set: options },
                answer: { $set: undefined },
              },
            })
          );
        }
      },
    });
  };
  const handleChangeShuffle = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setData((d) => ({ ...d, shuffle: checked }));
  };

  useEffect(() => {
    if (!data?.multiple?.options && data?.type === "multiple") {
      const options: dataTypes[] = Array.from(Array(4).keys()).map(() => ({
        key: genKey(),
        type: "paragraph",
      }));
      setData((d) =>
        update(d, { multiple: { $set: { options, answer: options[0].key } } })
      );
    }
  }, [data, genKey, setData]);

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
      {data?.multiple?.options?.map((item, index, options) => (
        <AnswerBox key={item.key}>
          <SelectType
            type={item.type}
            image={item.image}
            paragraph={item.paragraph}
            onChange={handleChangeOption(index, item.key)}
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
                    checked={item.key === data?.multiple?.answer}
                    onChange={() =>
                      setData((d) =>
                        update(d, { multiple: { answer: { $set: item.key } } })
                      )
                    }
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
