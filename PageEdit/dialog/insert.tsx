import { ShowTypes, usePE } from "../context";
import { Blocks } from "../content/blocks";
import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useCore } from "../../context";
import { DialogCompact } from "../../DialogCompact";
import { PickIcon } from "../../PickIcon";

export const DialogInsert = () => {
  const { t } = useCore();
  const {
    show,
    setData,
    state: { insert },
    setState,
    pageData,
  } = usePE();

  const handleClose = () => setState((s) => ({ ...s, insert: null }));
  const handleAdd = (type: ShowTypes) => () => {
    if(insert){
      setData(pageData.content.insert(insert,type).toJSON())
    }
    handleClose();
  };

  return (
    <DialogCompact
      open={Boolean(insert)}
      title={t("Insert Before")}
      onClose={handleClose}
      icon="diagram-predecessor"
    >
      <List>
        <Divider />
        {Blocks.filter((block) => show.includes(block.key)).map((block) => (
          <ListItemButton
            divider
            key={block.key}
            onClick={handleAdd(block.key)}
          >
            <ListItemIcon>
              <PickIcon icon={block.icon} />
            </ListItemIcon>
            <ListItemText primary={t(block.title)} />
          </ListItemButton>
        ))}
      </List>
    </DialogCompact>
  );
};
