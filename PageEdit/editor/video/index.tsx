import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useCore } from "../../../context";
import { PickIcon } from "../../../PickIcon";
import { VideoContent, VideoDisplay } from "../../../VideoDisplay";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";
import { SettingDialog } from "./setting";

export const PEEditorVideo = ({ index, content }: PEEditorProps) => {
  const { t, open, setOpen } = useCore();
  const { data, setData } = usePE();

  const handleToggle = () =>
    setOpen((o) => ({
      ...o,
      [`videoSetting-${content.key}`]: !Boolean(
        o[`videoSetting-${content.key}`]
      ),
    }));
  const handleConfirm = (video: VideoContent) => {
    setData(data.contentSet(content.key, "video", video));
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
            <PickIcon icon={"cog"} />
          </ListItemIcon>
          <ListItemText primary={t("Setting")} />
        </ListItemButton>
      }
    >
      <Box sx={{ position: "relative", backgroundColor: grey[200] }}>
        <VideoDisplay value={content?.video} />
      </Box>
      <SettingDialog
        open={Boolean(open[`videoSetting-${content.key}`])}
        onClose={handleToggle}
        value={content.video}
        onChange={handleConfirm}
      />
    </PEPanel>
  );
};
