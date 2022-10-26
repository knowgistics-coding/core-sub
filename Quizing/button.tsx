import { styled, Button, ButtonProps } from "@mui/material";
import { useCore } from "../context";
import { PickIcon, PickIconName } from "../PickIcon";

type SimpleButtonProps = ButtonProps & { icon: PickIconName };
const SimpleButton = styled(({ icon, ...props }: SimpleButtonProps) => (
  <Button variant="outlined" startIcon={<PickIcon icon={icon} />} {...props} />
))<SimpleButtonProps>({});

export const NextButton = (props: ButtonProps) => {
  const { t } = useCore();
  return (
    <SimpleButton icon="chevron-right" color="info" {...props}>
      {t("Next")}
    </SimpleButton>
  );
};

export const PrevButton = (props: ButtonProps) => {
  const { t } = useCore();
  return (
    <SimpleButton icon="chevron-left" color="neutral" {...props}>
      {t("Back")}
    </SimpleButton>
  );
};

export const SendButton = (props: ButtonProps) => {
  const { t } = useCore();
  return (
    <SimpleButton
      variant="contained"
      icon="paper-plane"
      color="success"
      {...props}
    >
      {t("Submit")}
    </SimpleButton>
  );
};
