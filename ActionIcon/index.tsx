import { IconButton, IconButtonProps, styled } from "@mui/material";
import { useCore } from "../context";
import { PickIcon, PickIconProps } from "../PickIcon";

export type ActionIconProps = IconButtonProps &
  Pick<PickIconProps, "icon"> & {
    iconProps?: Omit<PickIconProps, "icon">;
  };
export const ActionIcon = styled(
  ({ icon, iconProps, ...props }: ActionIconProps) => {
    const { isMobile } = useCore();
    return (
      <IconButton size={isMobile ? "medium" : "small"} color="info" {...props}>
        <PickIcon icon={icon} {...iconProps} />
      </IconButton>
    );
  }
)({});
