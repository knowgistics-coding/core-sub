import { Slide, SlideProps } from "@mui/material";
import { Map } from "../Controller/map";
import { DialogCompact, DialogCompactProps } from "../DialogCompact";
import { LeafletContainer, LeafletMap } from "../LeafLet";

export type DialogMapsProps = Pick<
  DialogCompactProps,
  "open" | "onClose" | "icon" | "title"
> & {
  maps: Map[];
};

export const DialogMaps = (props: DialogMapsProps) => {
  return (
    <DialogCompact
      maxWidth="sm"
      {...props}
      componentProps={{
        dialog: {
          TransitionComponent: Slide,
          TransitionProps: { direction: "down" } as SlideProps,
        },
      }}
    >
      <LeafletContainer rootProps={{ sx: { width: "100%", height: "50vh" } }}>
        <LeafletMap maps={props.maps} />
      </LeafletContainer>
    </DialogCompact>
  );
};
