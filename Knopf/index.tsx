import { Button, IconButton, IconButtonProps, styled } from "@mui/material";
import { useCore } from "../context";
import { PickIcon, PickIconProps } from "../PickIcon";

const IconButtonStyled = styled(IconButton)({
  width: 48,
  height: 48,
  border: `solid 1px currentColor`,
});
IconButtonStyled.defaultProps = {
  color: "primary",
};

export type KnopfProps = Pick<
  IconButtonProps,
  "sx" | "children" | "onClick"
> & {
  icon: PickIconProps["icon"];
  color?: Exclude<IconButtonProps["color"], "default">;
  componentProps?: {
    iconButton?: Omit<IconButtonProps, "onClick" | "sx" | "children" | "color">;
    button?: Omit<IconButtonProps, "onClick" | "sx" | "children" | "color">;
  };
};

export const Knopf = ({
  sx,
  children,
  onClick,
  icon,
  color,
  ...props
}: KnopfProps) => {
  const { isMobile } = useCore();

  return isMobile ? (
    <IconButtonStyled
      onClick={onClick}
      sx={sx}
      color={color}
      {...props.componentProps?.iconButton}
    >
      <PickIcon icon={icon} />
    </IconButtonStyled>
  ) : (
    <Button
      {...props.componentProps?.button}
      variant="outlined"
      startIcon={<PickIcon icon={icon} />}
      onClick={onClick}
      color={color}
      sx={sx}
    >
      {children}
    </Button>
  );
};
