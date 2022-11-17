import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";
import { usePE } from "../../context";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useCore } from "../../../context";
import { Absatz } from "../../../Absatz";
import { PickIcon } from "../../../PickIcon";

export const PEEditorParagraph = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const {
    state: { focus },
    data,
    setData,
  } = usePE();

  const handleChange = (value: string) => {
    setData(data.contentSet(content.key, "paragraph", { value }));
  };
  const handleEnter = (paragraphs: string[]) => {
    setData(data.paragraphEnter(content.key, paragraphs));
  };
  const handleConvertToHeading = () =>
    setData(data.paragraphToHeading(content.key));

  return (
    <PEPanel
      contentKey={content.key}
      content={content}
      index={index}
      actions={
        <ListItemButton onClick={handleConvertToHeading}>
          <ListItemIcon>
            <PickIcon icon={"retweet"} />
          </ListItemIcon>
          <ListItemText
            primary={t("Convert to $Name", { name: t("Heading") })}
          />
        </ListItemButton>
      }
    >
      <Absatz
        autoHideToolbar
        autoFocus={focus === content.key}
        value={content.paragraph?.value}
        onChange={handleChange}
        onEnter={handleEnter}
      />
    </PEPanel>
  );
};
