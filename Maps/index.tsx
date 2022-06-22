import * as React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { minimalOptions } from "./set.minimal";
import { CreateButton } from "./create.button";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export * from './maps.icon'

export type MapPosition = { lat: number; lng: number };

const center: MapPosition = { lat: 13.565438, lng: 100.578203 };
const thailangBounds: MapPosition[] = [
  { lat: 20.67093604395338, lng: 97.29951682397451 },
  { lat: 5.6290204418308365, lng: 105.44833030052126 },
];

export interface GoogleMapsProps {
  children?: React.ReactNode
  minimal?: boolean;
  onLoad?: (map:google.maps.Map) => void
}

export const GoogleMaps = React.memo(({onLoad:onMapLoad,...props}: GoogleMapsProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA7CwMnSzTDeJJreyBOEJ18VBKnO2St08k",
  });

  const [, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // FIT BOUNDS
    const bounds = new window.google.maps.LatLngBounds();
    thailangBounds.forEach((latlng) => bounds.extend(latlng));
    map.fitBounds(bounds);
    setMap(map);

    // MINIMAL
    const customMapType = new google.maps.StyledMapType(minimalOptions,
      { name: "Minimal Style" }
    );
    const customMapTypeId = "minimal_style";
    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);

    const newbutton = CreateButton()
    newbutton.addEventListener('click', () => map.setMapTypeId(customMapTypeId))
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(newbutton)

    if(onMapLoad){
      onMapLoad?.(map)
    }
  }, [onMapLoad]);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {props.children}
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
});
