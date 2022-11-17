import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCore } from "../../../context";
import { HeaderEditor } from "../../../HeaderEditor";
import { PickIcon } from "../../../PickIcon";
import { PageContentTypes, usePE } from "../../context";
import { PEPanel } from "../../panel";

export interface PEEditorProps {
  index: number;
  content: PageContentTypes;
  isDrag?: boolean;
}
export const PEEditorHeading = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const {
    state: { focus },
    setState,
    data,
    setData,
  } = usePE();

  const handleChange = (value: string) => {
    setData(data.contentMerge(content.key, "heading", { value }));
  };
  const handleChangeOption = (key: string, value: unknown) => {
    setData(data.contentMerge(content.key, "heading", { [key]: value }));
  };
  const handleFocus = (value: boolean) => () =>
    setState((s) => ({ ...s, focus: value ? content.key : null }));
  const handleConvertToParagraph = () => {
    setData(data.headingToParagraph(content.key));
  };
  const handleEnter = (values: string[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(values);
      // setData(data.paragraphEnter(content.key, paragraphs));
    }
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToParagraph}>
          <ListItemIcon>
            <PickIcon icon={"retweet"} />
          </ListItemIcon>
          <ListItemText
            primary={t("Convert to $Name", { name: t("Paragraph") })}
          />
        </ListItemButton>
      }
    >
      <HeaderEditor
        editorProps={{
          toolbarHidden: focus !== content.key,
          onFocus: handleFocus(true),
          onBlur: handleFocus(false),
        }}
        value={content.heading?.value}
        onChange={handleChange}
        variant={content.heading?.variant}
        onChangeOption={handleChangeOption}
        onEnter={handleEnter}
      />
    </PEPanel>
  );
};
