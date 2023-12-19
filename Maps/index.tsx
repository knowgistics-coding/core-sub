import * as React from "react";
import {
  GoogleMap,
  GoogleMapProps,
  Libraries,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { minimalOptions } from "./set.minimal";
import { CreateButton, CreateCustomButton } from "./create.button";
import { MapIcon } from "../Controller/map";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export * from "./maps.icon";

export type MapPosition = { lat: number; lng: number };

const center: MapPosition = { lat: 13.565438, lng: 100.578203 };
const thailangBounds: MapPosition[] = [
  { lat: 20.67093604395338, lng: 97.29951682397451 },
  { lat: 5.6290204418308365, lng: 105.44833030052126 },
];

export interface GoogleMapsProps
  extends Omit<
    GoogleMapProps,
    "mapContainerStyle" | "center" | "zoom" | "onLoad" | "onUnmount"
  > {
  children?: React.ReactNode;
  minimal?: boolean;
  onLoad?: (map: google.maps.Map) => void;
  searchRef?: React.MutableRefObject<HTMLInputElement | undefined>;
  onSearchEnd?: (places: google.maps.places.PlaceResult[]) => void;
}

const libs: Libraries = ["places"];

export const GoogleMaps = React.memo(
  ({
    onLoad: onMapLoad,
    searchRef,
    onSearchEnd,
    children,
    ...props
  }: GoogleMapsProps) => {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: `${process.env.REACT_APP_MAP_API_KEY}`,
      libraries: libs,
    });
    const [state, setState] = React.useState<{
      map: google.maps.Map | null;
      current: Record<"lat" | "lng", number> | null;
      pushed: boolean;
    }>({
      current: null,
      map: null,
      pushed: false,
    });

    if (!Boolean(process.env.REACT_APP_MAP_API_KEY)) {
      console.warn(`Map API not found`);
    }

    const onLoad = React.useCallback(
      function callback(map: google.maps.Map) {
        // FIT BOUNDS
        const bounds = new window.google.maps.LatLngBounds();
        thailangBounds.forEach((latlng) => bounds.extend(latlng));
        map.fitBounds(bounds);

        setState((s) => ({ ...s, map }));

        // MINIMAL
        const customMapType = new google.maps.StyledMapType(minimalOptions, {
          name: "Minimal Style",
        });
        const customMapTypeId = "minimal_style";
        map.mapTypes.set(customMapTypeId, customMapType);
        map.setMapTypeId(customMapTypeId);

        const newbutton = CreateButton();
        newbutton.addEventListener("click", () =>
          map.setMapTypeId(customMapTypeId)
        );
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(newbutton);

        if (searchRef?.current && onSearchEnd) {
          const searchBox = new window.google.maps.places.SearchBox(
            searchRef.current
          );
          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
            if (places) {
              onSearchEnd(places);
            }
          });
        }

        if (onMapLoad) {
          onMapLoad?.(map);
        }

        setState((s) => ({ ...s, map }));
      },
      [onMapLoad, searchRef, onSearchEnd]
    );

    const onUnmount = React.useCallback(function callback(
      _map: google.maps.Map
    ) {
      setState((s) => ({ ...s, map: null }));
    },
    []);

    React.useEffect(() => {
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(({ coords }) => {
          setState((s) => {
            const current = { lat: coords.latitude, lng: coords.longitude };

            if (s.map && s.pushed === false) {
              const btn = CreateCustomButton((btn) => {
                btn.innerHTML = `<img src="${MapIcon.current()}" style="width:20px;height:20px" />`;
                btn.addEventListener("click", () => {
                  s.map?.setCenter(current);
                });
                return btn;
              });

              s.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(btn);
              return { ...s, current, pushed: true };
            } else {
              return { ...s, current };
            }
          });
        });
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      }
    }, []);

    return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        {...props}
      >
        {children}
        {/* Child components, such as markers, info windows, etc. */}
        <>
          {state.current && (
            <Marker position={state.current} icon={MapIcon.me()} />
          )}
        </>
      </GoogleMap>
    ) : (
      <></>
    );
  }
);
