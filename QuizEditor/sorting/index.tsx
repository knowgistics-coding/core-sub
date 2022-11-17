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
import { Fragment } from "react";
import { useQEC } from "../context";
import { Panel } from "../panel";
import { SelectType } from "../select.type";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
} from "react-sortable-hoc";
import { useCore } from "../../context";
import { KuiButton } from "../../KuiButton";
import { usePopup } from "../../Popup";
import { PickIcon } from "../../PickIcon";
import { QuestionData } from "../../Controller";

const AnswerBox = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  "&:not(:last-child)": {
    marginBottom: theme.spacing(2),
  },
}));

const SortHandle = SortableHandle(() => (
  <IconButton size="small" style={{ cursor: "move" }}>
    <PickIcon icon={"bars"} />
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
  const { open, data, setData, onTabOpen } = useQEC();
  const { Popup } = usePopup();

  const handleChangeOption =
    (index: number) => (option: Omit<QuestionData, "key">) =>
      setData(data.setOption(index, option));
  const handleMove = ({ newIndex, oldIndex }: SortEnd) =>
    setData(data.moveOption(oldIndex, newIndex));
  const handleRemove = (key: string) => () => {
    Popup.remove({
      title: t("Remove"),
      text: t("Do You Want To Remove $Name", { name: t("Choice") }),
      icon: "trash",
      onConfirm: () => setData(data.removeOption(key)),
    });
  };
  const handleAdd = () => setData(data.addOption());

  return (
    <Panel
      expanded={open["answer"]}
      title={t("Answer")}
      onChange={onTabOpen("answer")}
    >
      <SortList onSortEnd={handleMove} useDragHandle>
        {data.options.map((option, index, options) => (
          <SortListItem index={index} key={option.key}>
            <SelectType
              type={option.type}
              image={option.image}
              paragraph={option.paragraph}
              onChange={handleChangeOption(index)}
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
    </Panel>
  );
};
