import {
  Box,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  styled,
} from "@mui/material";
import { Fragment } from "react";
import { PickIcon } from "../PickIcon";

const ListItemBlock = styled(ListItem)(({ theme }) => ({
  border: `solid 1px ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(1),
}));

export interface FileTypes {
  value: {
    name: string;
    size: number;
    original: string;
  };
}
export interface FileDisplayProps {
  content: FileTypes;
  Link: any;
}
export const FileDisplay = ({ content }: FileDisplayProps) => {
  return (
    <Fragment>
      {" "}
      <ListItemBlock divider>
        <ListItemIcon>
          <PickIcon icon={"file-alt"} size="2x" />
        </ListItemIcon>
        <ListItemText
          primary={content.value.name || "Untitled"}
          secondary={
            "Size" +
            ` : ${
              content.value
                ? (content.value.size / (1024 * 1024)).toFixed(2) + " MB"
                : "UnknownSize"
            }`
          }
          secondaryTypographyProps={{ variant: "caption" }}
        />
        <Box mt={2} />
        {content.value && (
          <IconButton
            size="small"
            color="primary"
            component={"a"}
            href={content.value.original}
            target="_blank"
          >
            <PickIcon size="1x" icon={"download"} />
          </IconButton>
        )}
      </ListItemBlock>
    </Fragment>
  );
};
