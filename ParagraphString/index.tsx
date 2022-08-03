import { useEffect, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import {
  ContentState,
  convertFromRaw,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import {
  Box,
  styled,
  Typography,
  TypographyProps,
  TypographyVariant,
} from "@mui/material";
import { toolbar } from "./toolbar";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useCore } from "../context";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const StyledEditor = styled(Editor)({
  backgroundColor: "white",
  padding: "0 16px",
  border: "1px solid #F1F1F1",
  minHeight: "160px",
});

export const parseParagraph = (value?: RawDraftContentState) =>
  (value &&
    Array.isArray(value.blocks) &&
    value.blocks.map((block) => block.text).join(" \n")) ||
  "";

interface StateTypes {
  editorState?: EditorState;
  contentState?: RawDraftContentState;
}
export interface ParagraphProps {
  value?: RawDraftContentState | string;
  onChange?: (value?: RawDraftContentState) => void;
  onChangeHTML?: (html: string) => void;
  editorProps?: Omit<
    EditorProps,
    | "toolbar"
    | "editorState"
    | "stripPastedStyles"
    | "onEditorStateChange"
    | "onContentStateChange"
    | "placeholder"
  >;
  onEnter?: (paragraphs: string[]) => void;
  dense?: boolean;
  variant?: TypographyVariant;
  align?: TypographyProps["textAlign"];
  view?: boolean;
  color?: TypographyProps["color"];
}
export const Paragraph = ({
  value,
  onChange,
  onChangeHTML,
  editorProps,
  onEnter,
  ...props
}: ParagraphProps) => {
  const { isMobile } = useCore();
  const [state, setState] = useState<StateTypes>({});

  const handleEditorStateChange = (editorState: EditorState) =>
    setState((s) => ({ ...s, editorState }));
  const handleContentStateChange = (contentState: RawDraftContentState) => {
    setState((s) => ({ ...s, contentState }));
    if (state.contentState) {
      onChange?.(state.contentState);
      onChangeHTML?.(draftToHtml(state.contentState));
      if (contentState.blocks.length > 1 && onEnter) {
        const paragraphs = contentState.blocks
          .map(
            (block) =>
              ({
                blocks: [block],
                entityMap: state.contentState?.entityMap,
              } as RawDraftContentState)
          )
          .map((content) => draftToHtml(content));
        onEnter?.(paragraphs);
      }
    }
  };
  const handleBlur = () => {
    if (state.contentState) {
      onChange?.(state.contentState);
      onChangeHTML?.(draftToHtml(state.contentState));
    }
  };

  useEffect(() => {
    if (value && !state.contentState) {
      if (typeof value === "string") {
        const content = htmlToDraft(value);
        const contentState = ContentState.createFromBlockArray(
          content.contentBlocks,
          content.entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        setState((s: StateTypes) => ({ ...s, editorState }));
      } else {
        const editorState = EditorState.createWithContent(
          convertFromRaw(value)
        );
        setState((s: StateTypes) => ({
          ...s,
          editorState,
          contentState: value,
        }));
      }
    }
  }, [value, state?.contentState]);

  return (
    <Box
      sx={{
        "& .rdw-editor-main": {
          padding: "4px 0",
          ...(!Boolean(editorProps?.toolbarHidden)
            ? {
                backgroundColor: "background.paper",
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "text.secondary",
                borderTopWidth: 0,
                paddingLeft: 2,
                paddingRight: 2,
              }
            : {
                border: "none",
              }),
        },
        "& .public-DraftStyleDefault-block": {
          lineHeight: 1.25,
          margin: props.dense ? "0" : undefined,
          height: "auto",
        },
        ...(!Boolean(editorProps?.toolbarHidden)
          ? {
              "& .rdw-editor-toolbar": {
                backgroundColor: "background.paper",
                border: `solid 1px`,
                borderColor: "text.secondary",
                marginBottom: 0,
              },
            }
          : {}),
      }}
    >
      <Typography
        variant={props.variant || "body2"}
        textAlign={props.align}
        component={"div"}
        color={props.color || "inherit"}
      >
        <StyledEditor
          toolbar={toolbar(isMobile)}
          editorState={state.editorState}
          stripPastedStyles
          onEditorStateChange={handleEditorStateChange}
          onContentStateChange={handleContentStateChange}
          placeholder={props.view ? undefined : "Start writting or type"}
          onBlur={handleBlur}
          {...editorProps}
          key={`mobile-${isMobile}`}
        />
      </Typography>
    </Box>
  );
};
