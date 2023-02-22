import { IconName } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Button, ButtonProps, styled } from "@mui/material";
import { TFunction } from "../context";

const BaseButton = styled(Button)({});
BaseButton.defaultProps = {
  fullWidth: true,
  size: "large",
  variant: "outlined",
};

const Icon = ({
  icon,
  ...props
}: { icon: IconName } & Omit<FontAwesomeIconProps, "icon">) => (
  <FontAwesomeIcon icon={["far", icon]} {...props} />
);

export type ProfileButtonProps = ButtonProps & { t: TFunction };

export const ProfileButton = {
  Loading: ({ t, ...props }: ProfileButtonProps) => (
    <BaseButton disabled {...props} startIcon={<Icon icon={"spinner"} pulse />}>
      {t("Loading")}
    </BaseButton>
  ),
  Edit: ({ t, ...props }: ProfileButtonProps) => (
    <BaseButton startIcon={<Icon icon={"edit"} />} color="warning" {...props}>
      {t("Edit")}
    </BaseButton>
  ),
  Follow: ({ t, ...props }: ProfileButtonProps) => (
    <BaseButton startIcon={<Icon icon={"user-plus"} />} {...props}>
      {t("Follow")}
    </BaseButton>
  ),
  Unfollow: ({ t, ...props }: ProfileButtonProps) => (
    <BaseButton
      startIcon={<Icon icon={"user-xmark"} />}
      color="error"
      {...props}
    >
      {t("Unfollow")}
    </BaseButton>
  ),
};
