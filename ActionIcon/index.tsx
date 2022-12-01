import { IconButton, IconButtonProps, styled } from "@mui/material";
import { forwardRef } from "react";
import { useCore } from "../context";
import { PickIcon, PickIconProps } from "../PickIcon";

export type ActionIconProps = IconButtonProps &
  Pick<PickIconProps, "icon"> & {
    iconProps?: Omit<PickIconProps, "icon">;
  };
export const ActionIcon = styled(
  forwardRef<HTMLButtonElement, ActionIconProps>(
    ({ icon, iconProps, ...props }, ref) => {
      const { isMobile } = useCore();
      return (
        <IconButton
          ref={ref}
          size={isMobile ? "medium" : "small"}
          color="info"
          {...props}
        >
          <PickIcon icon={icon} {...iconProps} />
        </IconButton>
      );
    }
  )
)({
  "&.MuiIconButton-sizeLarge": {
    width: 48,
    height: 48,
  },
});

export default ActionIcon;
