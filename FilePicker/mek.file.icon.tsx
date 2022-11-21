import {
  faFileExcel,
  faFilePdf,
  faFilePowerpoint,
  faFileWord,
} from "@fortawesome/pro-regular-svg-icons";
import { MekFile } from "../Controller/file";
import { PickIcon } from "../PickIcon";

export const MekFileIcon = ({ file }: { file: MekFile }): JSX.Element => {
  if (file.content?.mime && /image/.test(file.content.mime)) {
    return <PickIcon icon="image" />;
  } else if (file.content?.ext) {
    switch (file.content.ext) {
      case "xlsx":
      case "xls":
        return <PickIcon icon={faFileExcel} />;
      case "doc":
      case "docx":
      case "xml":
        return <PickIcon icon={faFileWord} />;
      case "pdf":
        return <PickIcon icon={faFilePdf} />;
      case "pot":
      case "potx":
      case "ppt":
      case "pptx":
        return <PickIcon icon={faFilePowerpoint} />;
    }
  } else if (file.type === "folder") {
    return <PickIcon icon="folder" />;
  }
  return <></>;
};
