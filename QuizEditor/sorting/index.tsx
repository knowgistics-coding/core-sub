import {
  Box,
  BoxProps,
  Button,
  IconButton,
  List,
  ListProps,
  styled,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { dataTypes, useQEC } from "../context";
import { Panel } from "../panel";
import { SelectType } from "../select.type";
import { arrayMoveImmutable } from "array-move";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
} from "react-sortable-hoc";
import { useCore } from "../../context";
import update from "react-addons-update";
import { DialogRemove } from "../../DialogRemove";
import { KuiButton } from "../../KuiButton";

const AnswerBox = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  "&:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

const SortHandle = SortableHandle(() => (
  <IconButton size="small" style={{ cursor: "move" }}>
    <FontAwesomeIcon icon={["fad", "bars"]} />
  </IconButton>
));

const SortListItem = SortableElement<BoxProps>((props: BoxProps) => (
  <AnswerBox {...props} />
));

const SortList = SortableContainer<ListProps>((props: ListProps) => {
  return <List disablePadding {...props} />;
});

export const OptionsSorting = () => {
  const { t } = useCore();
  const { genKey, open, data, setData, onTabOpen } = useQEC();
  const [del, setDel] = useState<number | null>(null);

  const handleChangeOption =
    (index: number, key: number) => (data: Omit<dataTypes, "key">) => {
      setData((d) =>
        update(d, {
          sorting: { options: { [index]: { $set: { ...data, key } } } },
        })
      );
    };
  const handleMove = ({ newIndex, oldIndex }: SortEnd) => {
    if (data.sorting?.options) {
      const options = arrayMoveImmutable(
        data.sorting?.options,
        oldIndex,
        newIndex
      );
      const answers = options.map((opt) => opt.key);
      setData((d) =>
        update(d, {
          sorting: { options: { $set: options }, answers: { $set: answers } },
        })
      );
    }
  };
  const handleRemove = (key: number | null) => () => setDel(key);
  const handleRemoveConfirm = () => {
    if (data?.sorting?.options) {
      const options = data.sorting.options.filter((opt) => opt.key !== del);
      const answers = options.map((opt) => opt.key);
      setData((d) => update(d, { sorting: { $set: { options, answers } } }));
      setDel(null);
    }
  };
  const handleAdd = () => {
    if (data?.sorting?.options) {
      const options = data.sorting.options.concat({
        key: genKey(),
        type: "paragraph",
      });
      const answers = options.map((opt) => opt.key);
      setData((d) => update(d, { sorting: { $set: { options, answers } } }));
    }
  };

  useEffect(() => {
    if (!data?.sorting?.options && data?.type === "sorting") {
      const options: dataTypes[] = Array.from(Array(4).keys()).map(() => ({
        key: genKey(),
        type: "paragraph",
      }));
      const answers = options.map((opt) => opt.key);
      setData((d) => update(d, { sorting: { $set: { options, answers } } }));
    }
  }, [data, genKey, setData]);

  return (
    <Panel
      expanded={open["answer"]}
      title={t("Answer")}
      onChange={onTabOpen("answer")}
    >
      <SortList onSortEnd={handleMove} useDragHandle>
        {data?.sorting?.options?.map((option, index, options) => (
          <SortListItem index={index} key={option.key}>
            <SelectType
              type={option.type}
              image={option.image}
              paragraph={option.paragraph}
              onChange={handleChangeOption(index, option.key)}
              actions={
                <Fragment>
                  <SortHandle />
                  <Box mr={1} />
                  <Typography variant="body1">
                    <strong>{t("Sequence") + " " + (index + 1)}</strong>
                  </Typography>
                </Fragment>
              }
            />
            {options.length > 2 && (
              <Box mt={1} display="flex" justifyContent="flex-end">
                <KuiButton
                  tx="remove"
                  size="small"
                  variant="outlined"
                  onClick={handleRemove(option.key)}
                />
              </Box>
            )}
          </SortListItem>
        ))}
      </SortList>
      <Box textAlign="right" mt={2}>
        <Button color="primary" onClick={handleAdd}>
          {t("Add Answer")}
        </Button>
      </Box>
      <DialogRemove
        open={Boolean(del)}
        onClose={handleRemove(null)}
        onConfirm={handleRemoveConfirm}
      />
    </Panel>
  );
};
