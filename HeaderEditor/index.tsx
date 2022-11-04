import { styled, Typography } from "@mui/material";
import {
  ContentState,
  convertFromHTML,
  EditorState,
  RawDraftContentState,
} from "draft-js";
import { useEffect, useState } from "react";
import { Editor, EditorProps } from "react-draft-wysiwyg";
import { variants, VariantSetting } from "./variant.setting";
import draftToHTML from "draftjs-to-html";
import { useCore } from "../context";
import draftToHtml from "draftjs-to-html";

export const toolbar = {
  options: ["history", "textAlign"],
  history: {
    inDropdown: false,
    options: ["undo", "redo"],
  },
  textAlign: {
    inDropdown: true,
    options: ["left", "center", "right"],
  },
};

export interface HeaderEditorProps {
  className?: string;
  value?: string;
  onChange?: (htmlValue: string) => void;
  onEnter?: (values: string[]) => void;
  variant?: variants;
  onChangeOption?: (key: string, value: any) => void;
  editorProps?: Omit<
    EditorProps,
    "toolbar" | "editorState" | "onEditorStateChange" | "onContentStateChange"
  >;
}

export const HeaderEditor = styled(
  ({
    className,
    value,
    onChange,
    variant = "h6",
    onChangeOption,
    editorProps,
    ...props
  }: HeaderEditorProps) => {
    const { t } = useCore();
    const [editorState, setEditorState] = useState<EditorState | undefined>();

    const handleSetVariant = (value: variants) =>
      onChangeOption?.("variant", value);

    const handleEditorStateChange = (editorState: EditorState) =>
      setEditorState(editorState);
    const handleContentStateChange = (contentState: RawDraftContentState) => {
      onChange?.(draftToHTML(contentState));
      const paragraphs = contentState.blocks
        .map(
          (block): RawDraftContentState => ({
            blocks: [block],
            entityMap: contentState.entityMap,
          })
        )
        .map((content) => draftToHtml(content));
      if (paragraphs.length > 1) {
        props.onEnter?.(paragraphs);
      }
    };

    useEffect(() => {
      if (!editorState && value) {
        const { contentBlocks, entityMap } = convertFromHTML(value);
        const editorState = EditorState.createWithContent(
          ContentState.createFromBlockArray(contentBlocks, entityMap)
        );
        setEditorState(editorState);
      }
    }, [value, editorState]);

    return (
      <Typography
        variant={variant}
        component="div"
        fontWeight="bold"
        textAlign="center"
      >
        <Editor
          editorClassName={className}
          toolbar={toolbar}
          toolbarCustomButtons={[
            <VariantSetting
              value={variant}
              onVariantChange={handleSetVariant}
            />,
          ]}
          editorState={editorState}
          onEditorStateChange={handleEditorStateChange}
          onContentStateChange={handleContentStateChange}
          placeholder={t("TypeHere")}
          stripPastedStyles
          {...editorProps}
        />
      </Typography>
    );
  }
)(() => ({
  overflow: "hidden",
  "& .public-DraftStyleDefault-block": {
    margin: "0.1em 0",
  },
}));
