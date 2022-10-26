import { Box, BoxProps, styled, Typography } from "@mui/material";
import L from "leaflet";
import { Fragment, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  MapContainerProps,
  useMap,
} from "react-leaflet";
import { getMarkerIcon } from "../Maps";
import "./index.css";

const Icon = new L.Icon({
  iconUrl: getMarkerIcon("travel").url,
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcMGT7U0AGSWR5MCUtN4-r3QEl5LfTGiD49g&usqp=CAU",
  iconRetinaUrl: getMarkerIcon("travel").url,
  // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcMGT7U0AGSWR5MCUtN4-r3QEl5LfTGiD49g&usqp=CAU",
  iconSize: new L.Point(40, 40),
  iconAnchor: new L.Point(20, 20),
  popupAnchor: new L.Point(0, -40),
  // className: "leaflet-div-icon",
});

const Root = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 480,
  height: 480,
  "&>div": {
    ...theme.mixins.absoluteFluid,
  },
}));

export type LeafletContainerProps = MapContainerProps & {
  rootProps?: BoxProps;
};
export const LeafletContainer = ({
  children,
  rootProps,
  ...props
}: LeafletContainerProps) => {
  return (
    <Root {...rootProps}>
      <MapContainer
        center={{ lat: 13.74574175868472, lng: 100.50150775714611 }}
        zoom={13}
        {...props}
      >
        {children}
      </MapContainer>
    </Root>
  );
};

export type LeafletMapProps = {
  onMapClick?: (event: L.LeafletMouseEvent) => void;
  children?: React.ReactNode;
};
export const LeafletMap = ({ onMapClick, ...props }: LeafletMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.addEventListener("click", (e) => onMapClick?.(e));
    return () => {
      map.removeEventListener("click");
    };
  }, [map, onMapClick]);

  return (
    <Fragment>
      <TileLayer
        attribution='&copy; <a href="https://www.google.com/help/terms_maps/" target="_blank">Google Maps</a>'
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Google Maps</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      <Marker
        position={{ lat: 13.74574175868472, lng: 100.50150775714611 }}
        icon={Icon}
      >
        <Popup>
          <Typography variant="h6">Bangkok</Typography>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {props.children}
    </Fragment>
  );
};
