import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Button, ButtonProps } from "@mui/material";
import { useCore } from "../context";

const browseFile = (accept?: string, multiple?: boolean): Promise<File[]> => {
  return new Promise((resolved) => {
    const input = document.createElement("input");
    if (accept) {
      input.accept = accept;
    }
    if (multiple) {
      input.multiple = multiple;
    }
    input.type = "file";
    input.onchange = () => {
      if (input.files && input.files.length) {
        resolved(Array.from(input.files));
      }
    };
    input.click();
  });
};

export type AttachFileProps = {
  onChange: (files: File[]) => void;
  componentProps?: {
    button?: Omit<ButtonProps, "children" | "startIcon" | "onClick">;
    icon?: FontAwesomeIconProps;
  };
  accept?: string;
  multiple?: boolean;
};
export const AttachFile = (props: AttachFileProps) => {
  const { t } = useCore();

  const handleClick = async () => {
    const files = await browseFile(props.accept, props.multiple);
    props.onChange(files);
  };

  return (
    <Button
      variant="outlined"
      color="info"
      startIcon={
        <FontAwesomeIcon
          icon={["far", "paperclip"]}
          {...props.componentProps?.icon}
        />
      }
      {...props.componentProps?.button}
      onClick={handleClick}
    >
      {t("AttachFiles")}
    </Button>
  );
};
