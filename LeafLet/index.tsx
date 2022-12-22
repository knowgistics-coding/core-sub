import { Box, BoxProps, styled } from "@mui/material";
import L from "leaflet";
import { ComponentType } from "react";
import { Fragment, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  MapContainerProps,
  useMap,
  Polyline,
  Polygon,
} from "react-leaflet";
import { Map as MekMap } from "../Controller/map";
import { getMarkerIcon } from "../Maps";
import "./index.css";
import { PopupWithLatLng } from "./popup";

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

export const useLeaflet =
  <T extends Record<any, unknown>>(Comp: ComponentType<T>) =>
  (props: T): JSX.Element => {
    return (
      <MapContainer
        center={{ lat: 13.74574175868472, lng: 100.50150775714611 }}
        zoom={13}
      >
        <Comp {...props} />
      </MapContainer>
    );
  };

export type LeafletMapProps = {
  onMapClick?: (event: L.LeafletMouseEvent) => void;
  maps?: MekMap[];
  children?: React.ReactNode;
};
export const LeafletMap = ({ onMapClick, ...props }: LeafletMapProps) => {
  const map = useMap();

  useEffect(() => {
    if ((props.maps?.length ?? 0) > 1) {
      const bounds = MekMap.getBounds(props.maps!);
      map.fitBounds(bounds, { padding: [24, 24] });
    }

    map.addEventListener("click", (e) => onMapClick?.(e));
    return () => {
      map.removeEventListener("click");
    };
  }, [map, onMapClick, props.maps]);

  return (
    <Fragment>
      <TileLayer
        attribution='&copy; <a href="https://www.google.com/help/terms_maps/" target="_blank">Google Maps</a>'
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Google Maps</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      {props.maps?.map((item) => {
        switch (item.type) {
          case "route":
            return (
              <Polyline
                positions={item.latLngs!}
                color={item.color}
                key={item.id}
              >
                <PopupWithLatLng title={item.title} />
              </Polyline>
            );
          case "area":
            return (
              <Polygon
                positions={item.latLngs!}
                color={item.color}
                fillOpacity={0.5}
                key={item.id}
              >
                <PopupWithLatLng title={item.title} />
              </Polygon>
            );
          case "marker":
            return (
              <Marker position={item.latLng!} icon={Icon} key={item.id}>
                <PopupWithLatLng title={item.title} latLng={item.latLng} />
              </Marker>
            );
          default:
            return null;
        }
      })}
      {props.children}
    </Fragment>
  );
};
