import {
  Box,
  BoxProps,
  Fab,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarContent,
  Stack,
} from "@mui/material";
import React, { MouseEvent, useCallback, useState } from "react";
import {
  SortableContainer as SC,
  SortableElement as SE,
  SortEnd,
} from "react-sortable-hoc";
import { useAlerts } from "../../Alerts";
import { Container } from "../../Container";
import { ContentHeader } from "../../ContentHeader";
import { useCore } from "../../context";
import { StockDisplay } from "../../StockDisplay";
import { usePE } from "../context";
import { PEEditorCover } from "../editor/cover";
import { PEEditorDivider } from "../editor/divider";
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
import { PEContentSelectAll } from "./select.all";
import { PEContentSpacingButton } from "./spacing.button";
import debounce from "lodash.debounce";
import { PickIcon } from "../../PickIcon";
import { PEEditorFile } from "../editor/file";

const SortableContainer = SC<BoxProps>(Box);
const SortableElement = SE<BoxProps>(Box);

export const PEContent = () => {
  const { t, isMobile } = useCore();
  const {
    data,
    setData,
    state: { selected },
    show,
    maxWidth,
    breadcrumbs,
    staticTitle,
  } = usePE();
  const [isStart, setIsStart] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(true);
  const { addAlert } = useAlerts();

  const handleSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    setData(data.contentSorting(oldIndex, newIndex));
    setIsStart(false);
  };

  const handleCopy = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(data)).then(() => {
        addAlert({ label: t("Copied") });
      });
    }
  }, [data, t, addAlert]);
  const handlePaste = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.readText().then((text) => {
        try {
          const newData = JSON.parse(text);
          if (newData?.contents) {
            data.contents = newData.contents;
            setData(data);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  }, [data, setData]);

  const debounceFn = debounce((e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 1) {
      setAddOpen((o) => !o);
    } else if (e.detail === 2) {
      handleCopy();
    } else if (e.detail === 3) {
      handlePaste();
    }
  }, 250);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => debounceFn(e),
    [debounceFn]
  );

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
              case "file":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorFile content={content} index={index} />
                  </SortableElement>
                );
              case "divider":
                return (
                  <SortableElement index={index} key={content.key}>
                    <PEEditorDivider content={content} index={index} />
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
        open={Boolean(selected.length)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <SnackbarContent
          message={`${selected.length} items selected`}
          action={
            <>
              <PEContentSelectAll />
              <PEContentSpacingButton />
              <PEContentDeleteButton />
              <PEContentDeselectButton />
            </>
          }
          sx={{ backgroundColor: "info.main", color: "info.contrastText" }}
        />
      </Snackbar>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" } as SlideProps}
      >
        <Box>
          <Fab size="small" onClick={handleClick}>
            <PickIcon
              icon={"chevron-left"}
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
