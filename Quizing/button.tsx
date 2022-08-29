import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled, Button, ButtonProps } from "@mui/material";
import { useCore } from "../context";

type SimpleButtonProps = ButtonProps & { icon: IconName };
const SimpleButton = styled(({ icon, ...props }: SimpleButtonProps) => (
  <Button
    variant="outlined"
    startIcon={<FontAwesomeIcon icon={["far", icon]} />}
    {...props}
  />
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
    <SimpleButton variant="contained" icon="paper-plane" color="success" {...props}>
      {t("Submit")}
    </SimpleButton>
  );
};

// export const SendButton = styled(Button)({});
// SendButton.defaultProps = {
//   variant: "contained",
//   children: t("Submit").toString(),
//   startIcon: <FontAwesomeIcon icon={["far", "paper-plane"]} />,
//   color: "info",
// };
