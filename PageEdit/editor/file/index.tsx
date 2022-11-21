import { faFileSlash } from "@fortawesome/pro-regular-svg-icons";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useCore } from "../../../context";
import { FileDisplay } from "../../../FileDisplay";
import { KuiActionIcon } from "../../../KuiActionIcon";
import { useMC } from "../../../MainContainer";
import { PickIcon } from "../../../PickIcon";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";

export const PEEditorFile = ({ index, content }: PEEditorProps) => {
  const { t } = useCore();
  const {
    state: { hideToolbar },
    data,
    setData,
  } = usePE();
  const { setState: setMCState } = useMC();

  const handleOpenFilePicker = () => {
    setMCState((s) => ({
      ...s,
      onFilePickerConfirm: (file) =>
        setData(data.contentSet(content.key, "file", file)),
    }));
  };
  const handleRemove = () => {
    setData(data.contentSet(content.key, "file", undefined));
  };

  return (
    <PEPanel
      content={content}
      index={index}
      contentKey={content.key}
      actions={
        <>
          <ListItemButton onClick={handleOpenFilePicker}>
            <ListItemIcon>
              <PickIcon icon={"edit"} />
            </ListItemIcon>
            <ListItemText primary={t("Change $Name", { name: t("File") })} />
          </ListItemButton>
          <ListItemButton onClick={handleRemove}>
            <ListItemIcon>
              <PickIcon icon={faFileSlash} />
            </ListItemIcon>
            <ListItemText primary={t("Remove $Name", { name: t("File") })} />
          </ListItemButton>
        </>
      }
    >
      <List sx={{ p: hideToolbar ? 0 : 2 }}>
        {content.file?.content ? (
          <FileDisplay
            content={{
              value: {
                name: content.file.content.name,
                size: content.file.content.size,
                original: content.file.content.downloadURL,
              },
            }}
            Link={content.file.content.downloadURL}
          />
        ) : (
          <ListItem>
            <ListItemIcon>
              <PickIcon icon={faFileSlash} />
            </ListItemIcon>
            <ListItemText secondary={t("Select $Name", { name: t("File") })} />
            <ListItemSecondaryAction>
              <KuiActionIcon tx="edit" onClick={handleOpenFilePicker} />
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </PEPanel>
  );
};
