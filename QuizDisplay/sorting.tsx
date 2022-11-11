import { Fragment, useEffect } from "react";
import { useQD } from "./context";
import {
  SortableElement,
  SortableContainer,
  SortEnd,
} from "react-sortable-hoc";
import { Box, Grid, GridProps } from "@mui/material";
import { ListButton } from "./list.button";
import { QDParagraph } from "./paragraph";
import { arrayShuffle } from "../func";
import { arrayMoveImmutable } from "array-move";
import { QDImgDisplay } from "../QuizEditor/img";
import { PickIcon } from "../PickIcon";

const SortContainer = SortableContainer<GridProps>((props: GridProps) => (
  <Grid container spacing={1} {...props} />
));

const SortItem = SortableElement<GridProps>((props: GridProps) => (
  <Grid item xs={12} {...props} sx={{ zIndex: 1300 }} />
));

export const QDSorting = () => {
  const { quiz, value, onChange } = useQD();

  const handleSortEnd = (data: SortEnd) => {
    const { oldIndex, newIndex } = data;
    if (oldIndex !== newIndex && value?.sorting) {
      const newValue = arrayMoveImmutable(value.sorting, oldIndex, newIndex);
      onChange((answer) => answer.setSorting(newValue));
    }
  };

  useEffect(() => {
    if (
      quiz.type === "sorting" &&
      quiz.options &&
      Boolean(value?.sorting) === false
    ) {
      const sorting = arrayShuffle(quiz.options.map((opt) => opt.key));
      onChange((answer) => answer.setSorting(sorting));
    }
  }, [quiz, onChange, value]);

  return (
    <Fragment>
      <SortContainer onSortEnd={handleSortEnd}>
        {value?.sorting?.map((id, index) => {
          const option = quiz.options.find((option) => option.key === id);
          if (option) {
            return (
              <SortItem index={index} key={id}>
                <ListButton
                  label={(() => {
                    switch (option.type) {
                      case "image":
                        return option?.image?._id ? (
                          <Box>
                            <QDImgDisplay id={option.image._id} />
                          </Box>
                        ) : undefined;
                      case "paragraph":
                        return <QDParagraph value={option.paragraph} />;
                      default:
                        return undefined;
                    }
                  })()}
                  icon={<PickIcon icon={"arrows"} />}
                />
              </SortItem>
            );
          } else {
            return null;
          }
        })}
      </SortContainer>
    </Fragment>
  );
};
