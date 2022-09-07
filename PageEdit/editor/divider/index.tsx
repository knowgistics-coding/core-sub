import { Box, Divider } from "@mui/material";
import { usePE } from "../../context";
import { PEPanel } from "../../panel";
import { PEEditorProps } from "../heading";

export const PEEditorDivider = ({ index, content }: PEEditorProps) => {
  const {
    state: { hideToolbar },
  } = usePE();
  return (
    <PEPanel content={content} index={index} contentKey={content.key}>
      <Box py={hideToolbar ? 0 : 1}>
        <Divider sx={{ borderColor: "text.primary" }} />
      </Box>
    </PEPanel>
  );
};
