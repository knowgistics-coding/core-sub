import { IconButton as IC, IconButtonProps, styled } from "@mui/material";
import { PickIcon, PickIconName } from "../PickIcon";

export const IconButton = styled(
  ({
    icon,
    ...props
  }: Omit<IconButtonProps, "children"> & { icon: PickIconName }) => (
    <IC size="small" {...props}>
      <PickIcon size="sm" icon={icon} />
    </IC>
  )
)({
  width: 24,
  height: 24,
});
