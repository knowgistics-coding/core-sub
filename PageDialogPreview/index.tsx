import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  SlideProps,
  styled,
  Toolbar,
} from "@mui/material";
import { PageDoc } from "../Controller/page";
import { PageViewer } from "../PageViewer";
import { PageViewerProps } from "../PageViewer/context";
import { PickIcon } from "../PickIcon";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  top: 0,
  borderBottom: `solid 1px ${theme.palette.divider}`,
}));
AppBarStyled.defaultProps = {
  elevation: 0,
  position: "sticky",
};

export type PageDialogPreviewProps = {
  value?: PageDoc;
  open: boolean;
  onClose?: () => void;
} & Pick<PageViewerProps, "overrideHeader">;

export const PageDialogPreview = (props: PageDialogPreviewProps) => {
  return (
    <Dialog
      fullScreen
      open={props.open}
      onClose={props.onClose}
      sx={{ zIndex: 1400 }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "down" } as SlideProps}
    >
      <AppBarStyled>
        <Toolbar>
          <IconButton edge="start" size="large" onClick={props.onClose}>
            <PickIcon icon="xmark" />
          </IconButton>
        </Toolbar>
      </AppBarStyled>
      {props.value && (
        <PageViewer
          noContainer
          overrideHeader={props.overrideHeader}
          data={props.value}
        />
      )}
    </Dialog>
  );
};
