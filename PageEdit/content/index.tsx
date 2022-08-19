import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  BoxProps,
  Fab,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
} from "@mui/material";
import { arrayMoveImmutable } from "array-move";
import React, { useState } from "react";
import update from "react-addons-update";
import {
  SortableContainer as SC,
  SortableElement as SE,
  SortEnd,
} from "react-sortable-hoc";
import { Container } from "../../Container";
import { ContentHeader } from "../../ContentHeader";
import { useCore } from "../../context";
import { StockDisplay } from "../../StockDisplay";
import { usePE } from "../context";
import { PEEditorCover } from "../editor/cover";
import { PEEditorHeading } from "../editor/heading";
import { PEEditorImage } from "../editor/image";
import { PEEditorParagraph } from "../editor/paragraph";
import { PEEditorSlide } from "../editor/slide";
import { PEEditorTable } from "../editor/table";
import { PEEditorVideo } from "../editor/video";
import { PEContentAddButton } from "./add.button";
import { PEContentDeleteButton } from "./delete.button";
import { PEContentDeselectButton } from "./deselect.button";
import { PEContentSaveButton } from "./save.button";
import { PEContentSpacingButton } from "./spacing.button";

const SortableContainer = SC<BoxProps>(Box);
const SortableElement = SE<BoxProps>(Box);

export const PEContent = () => {
  const { isMobile } = useCore();
  const { data, setData, show, maxWidth, breadcrumbs, staticTitle } = usePE();
  const [isStart, setIsStart] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(true);

  const handleSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (data.contents) {
      const newContents = arrayMoveImmutable(data.contents, oldIndex, newIndex);
      setData((d) => update(d, { contents: { $set: newContents } }));
    }
    setIsStart(false);
  };

  return (
    <React.Fragment>
      {show.includes("feature") && data.feature && (
        <StockDisplay {...data.feature} ratio={isMobile ? 1 : 1 / 4} />
      )}
      <Box pt={6} pb={12}>
        <Container maxWidth={maxWidth || "post"}>
          {staticTitle ? (
            <ContentHeader label={staticTitle} breadcrumbs={breadcrumbs} />
          ) : (
            show.includes("title") && (
              <ContentHeader label={data.title} breadcrumbs={breadcrumbs} />
            )
          )}
        </Container>
        <SortableContainer
          onSortEnd={handleSortEnd}
          onSortStart={() => setIsStart(true)}
          useDragHandle
        >
          {data?.contents?.map((content, index) => {
            switch (content.type) {
              case "heading":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorHeading content={content} index={index} />
                  </SortableElement>
                );
              case "paragraph":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorParagraph content={content} index={index} />
                  </SortableElement>
                );
              case "image":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorImage
                      content={content}
                      index={index}
                      isDrag={isStart}
                    />
                  </SortableElement>
                );
              case "video":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorVideo content={content} index={index} />
                  </SortableElement>
                );
              case "cover":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorCover content={content} index={index} />
                  </SortableElement>
                );
              case "slide":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorSlide content={content} index={index} />
                  </SortableElement>
                );
              case "table":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorTable content={content} index={index} />
                  </SortableElement>
                );
              default:
                return process.env.NODE_ENV === "development" ? (
                  <pre key={content.key}>
                    {JSON.stringify(content, null, 2)}
                  </pre>
                ) : null;
            }
          })}
        </SortableContainer>
      </Box>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box>
          <Stack spacing={1}>
            <PEContentSpacingButton />
            <PEContentDeleteButton />
            <PEContentDeselectButton />
          </Stack>
        </Box>
      </Snackbar>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" } as SlideProps}
      >
        <Box>
          <Fab size="small" onClick={() => setAddOpen((o) => !o)}>
            <FontAwesomeIcon
              icon={["far", "chevron-left"]}
              rotation={addOpen ? 180 : undefined}
              style={{ transition: "all 0.5s cubic-bezier(0.25,0,0,1.75) 0s" }}
            />
          </Fab>
        </Box>
      </Snackbar>
      <Snackbar
        open={addOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" } as SlideProps}
        sx={{
          "&.MuiSnackbar-root": {
            bottom: 72,
          },
        }}
      >
        <Box>
          <Stack alignItems={"flex-end"} spacing={1}>
            <PEContentAddButton />
            <PEContentSaveButton />
          </Stack>
        </Box>
      </Snackbar>
    </React.Fragment>
  );
};
