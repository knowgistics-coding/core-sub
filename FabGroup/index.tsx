import {
  Fab,
  FabProps,
  Slide,
  SlideProps,
  Snackbar,
  Stack,
  styled,
} from "@mui/material";
import * as React from "react";
import { PickIcon, PickIconName, PickIconProps } from "../PickIcon";

export type FabIconProps = FabProps & {
  icon: PickIconName;
  iconProps?: Omit<PickIconProps, "icon">;
};
export const FabIcon = styled(
  ({ icon, iconProps, ...props }: FabIconProps) => (
    <Fab {...props}>
      <PickIcon icon={icon} {...iconProps} />
    </Fab>
  )
)<FabIconProps>(() => (({theme}) => ({
  fontSize: theme.typography.body1.fontSize
})));
FabIcon.defaultProps = {
  color: "neutral",
  size: "small",
};

export type FabGroupProps = {
  children?: React.ReactNode;
};
export const FabGroup = (props: FabGroupProps) => {
  const [open, setOpen] = React.useState<boolean>(true);

  const handleToggle = () => setOpen((o) => !o);

  return (
    <React.Fragment>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          left: "auto",
          transform: "translateY(-48px)",
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "left" } as SlideProps}
      >
        <Stack alignItems="flex-end" spacing={1}>
          {props.children}
        </Stack>
      </Snackbar>
      <Snackbar
        open={true}
        sx={{ left: "auto" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <div>
          <Fab size="small" onClick={handleToggle}>
            <PickIcon
              icon={"chevron-left"}
              rotation={open ? 180 : undefined}
              style={{ transition: "all 0.5s cubic-bezier(0.25,0,0,1.75) 0s" }}
            />
          </Fab>
        </div>
      </Snackbar>
    </React.Fragment>
  );
};
