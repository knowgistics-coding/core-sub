import { Box, BoxProps, Link, styled, Typography } from "@mui/material";
import L from "leaflet";
import { useCallback } from "react";
import { Fragment, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  MapContainerProps,
  useMap,
} from "react-leaflet";
import { Map as MekMap } from "../Controller/map";
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
  maps?: MekMap[];
  children?: React.ReactNode;
};
export const LeafletMap = ({ onMapClick, ...props }: LeafletMapProps) => {
  const map = useMap();

  const mapFilter = useCallback((): MekMap[] => {
    return props.maps?.filter((map) => MekMap.validLatLng(map.latLng)) ?? [];
  }, [props.maps]);

  useEffect(() => {
    if (mapFilter().length) {
      const bounds = L.latLngBounds([]);
      mapFilter().map((m) => bounds.extend(m.latLng!));
      map.fitBounds(bounds);
    }

    map.addEventListener("click", (e) => onMapClick?.(e));
    return () => {
      map.removeEventListener("click");
    };
  }, [map, onMapClick, mapFilter]);

  return (
    <Fragment>
      <TileLayer
        attribution='&copy; <a href="https://www.google.com/help/terms_maps/" target="_blank">Google Maps</a>'
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Google Maps</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      {props.maps?.map(
        (map) =>
          MekMap.validLatLng(map.latLng) && (
            <Marker position={map.latLng!} icon={Icon} key={map.id}>
              <Popup>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ pb: 1, margin: "0 !important" }}
                >
                  {map.title}
                </Typography>
                <Link
                  href={`https://www.google.com/maps/dir/Current+Location/${map.latLng?.lat},${map.latLng?.lng}`}
                  target="_blank"
                >
                  Open in Google Maps
                </Link>
              </Popup>
            </Marker>
          )
      )}
      {props.children}
    </Fragment>
  );
};
