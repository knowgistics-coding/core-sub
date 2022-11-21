import { Avatar, Box, Chip, ChipProps, styled } from "@mui/material";
import { FileCtl } from "../Controller";
import { PickIcon } from "../PickIcon";

export type FileChipProps = ChipProps & {
  name: string;
  url: string;
};
export const FileChip = ({ url, name, ...props }: FileChipProps) => {
  return (
    <Chip
      avatar={
        <Avatar sx={{ backgroundColor: "white", color: "#333!important" }}>
          <PickIcon icon={"paperclip"} color="interit" />
        </Avatar>
      }
      color="info"
      label={name}
      onClick={() => FileCtl.downloadFromUrl(url, name)}
      {...props}
    />
  );
};

export const FileChipContainer = styled(Box)(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginBottom: theme.spacing(-1),
  "& .MuiChip-root": {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));
