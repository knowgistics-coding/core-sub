import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { grey } from "@mui/material/colors";
import update from "react-addons-update";
import { useCore } from "../../../context";
import { VideoContent, VideoDisplay } from "../../../VideoDisplay";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";
import { SettingDialog } from "./setting";

export const PEEditorVideo = ({ index, content }: PEEditorProps) => {
  const { t, open, setOpen } = useCore();
  const { setData } = usePE();

  const handleToggle = () =>
    setOpen((o) => ({ ...o, videoSetting: !Boolean(o.videoSetting) }));
  const handleConfirm = (video: VideoContent) => {
    setData((d) =>
      update(d, { contents: { [index]: { video: { $set: video } } } })
    );
    handleToggle();
  };

  return (
    <PEPanel
      content={content}
      contentKey={content.key}
      index={index}
      actions={
        <ListItemButton onClick={handleToggle}>
          <ListItemIcon>
            <FontAwesomeIcon icon={["far", "cog"]} />
          </ListItemIcon>
          <ListItemText primary={t("Setting")} />
        </ListItemButton>
      }
    >
      <Box sx={{ position: "relative", backgroundColor: grey[200] }}>
        <VideoDisplay content={content?.video} />
      </Box>
      <SettingDialog
        open={Boolean(open.videoSetting)}
        onClose={handleToggle}
        value={content.video}
        onChange={handleConfirm}
      />
    </PEPanel>
  );
};
