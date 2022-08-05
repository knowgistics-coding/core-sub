import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Chip, ChipProps } from "@mui/material";
import { FileCtl } from "../Controller";

export type FileChipProps = ChipProps & {
  name: string;
  url: string;
};
export const FileChip = ({ url, name, ...props }: FileChipProps) => {
  return (
    <Chip
      avatar={
        <Avatar sx={{ backgroundColor: "white", color: "#333!important" }}>
          <FontAwesomeIcon icon={["far", "paperclip"]} color="interit" />
        </Avatar>
      }
      color="info"
      label={name}
      onClick={() => FileCtl.downloadFromUrl(url, name)}
      {...props}
    />
  );
};
