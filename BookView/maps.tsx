import { Box, styled } from "@mui/material";
import { Marker, Polygon, Polyline } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Map } from "../Controller/map";
import { getMarkerIcon, GoogleMaps, MarkerCatType } from "../Maps";

const MapRoot = styled(Box)(() => ({
  width: "100%",
  height: `calc(100vh - 65px)`,
}));

export const BookViewMaps = (props: {
  maps: Map[];
  onClick?: (id: string) => void;
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    map: null | google.maps.Map;
  }>({
    loading: true,
    map: null,
  });

  const initMap = useCallback(() => {
    if (state.map) {
      if (props.maps.length > 1) {
        const Lbounds = Map.getBounds(props.maps);
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(Lbounds.getNorthEast());
        bounds.extend(Lbounds.getSouthWest());
        state.map.fitBounds(bounds);
      }
    }
  }, [state.map, props.maps]);

  const getLabel = useCallback((id: string):string => {
    const index = props.maps.filter(m => m.type === "marker").findIndex(m => m.id === id);
    return (index + 1).toString()
  }, [props.maps])

  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <MapRoot>
      <GoogleMaps onLoad={(map) => setState((s) => ({ ...s, map }))}>
        {props.maps.map((item, index) => {
          switch (item.type) {
            case "marker":
              return (
                <Marker
                  position={item.latLng}
                  icon={getMarkerIcon(item.cat as MarkerCatType, index)}
                  label={{
                    text: getLabel(item.id),
                    color: "#FFF",
                    fontWeight: "bold",
                  }}
                  onClick={() => props.onClick?.(item.id)}
                  key={item.id}
                />
              );
            case "route":
              return (
                <Polyline
                  path={item.latLngs}
                  key={item.id}
                  options={{
                    strokeColor: item.color,
                    strokeOpacity: 0.75,
                    strokeWeight: 4,
                  }}
                  onClick={() => props.onClick?.(item.id)}
                />
              );
            case "area":
              return (
                <Polygon
                  paths={item.latLngs}
                  key={item.id}
                  options={{
                    strokeColor: item.color,
                    strokeOpacity: 0.75,
                    strokeWeight: 4,
                    fillColor: item.color,
                    fillOpacity: 0.4,
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </GoogleMaps>
    </MapRoot>
  );
};
