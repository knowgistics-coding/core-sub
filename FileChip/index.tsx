import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Chip } from "@mui/material";
import { FileCtl } from "../Controller";

export type FileChipProps = {
  name: string;
  url: string;
};
export const FileChip = (props: FileChipProps) => {
  return (
    <Chip
      avatar={
        <Avatar sx={{ backgroundColor: "white" }}>
          <FontAwesomeIcon icon={["far", "paperclip"]} />
        </Avatar>
      }
      color="info"
      label={props.name}
      onClick={() => FileCtl.downloadFromUrl(props.url, props.name)}
    />
  );
};
