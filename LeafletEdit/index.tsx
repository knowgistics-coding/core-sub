import {
  Box,
  darken,
  Fab,
  Grid,
  Menu,
  Snackbar,
  SnackbarProps,
  Stack,
  styled,
  Tooltip,
} from "@mui/material";
import { LeafletMouseEvent } from "leaflet";
import React, {
  Fragment,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useCore } from "../context";
import { Map } from "../Controller/map";
import { DialogCompact } from "../DialogCompact";
import { MarkerCat, MarkerCatDict } from "../Maps";
import { PickIcon, PickIconName } from "../PickIcon";

//SECTION - Root
const Root = styled(Box)<{ ratio?: number }>(({ theme, ratio }) => ({
  position: "relative",
  width: "100%",
  backgroundColor: "red",
  paddingTop: `calc(100% * ${ratio ?? 9 / 16})`,
  "&>div.leaflet-container": {
    ...theme.mixins.absoluteFluid,
  },
}));
//!SECTION

//SECTION - SnackStyled
type SnackStyledProps = Omit<SnackbarProps, "children"> & {
  children?: React.ReactNode;
};
const SnackStyled = styled((props: SnackStyledProps) => (
  <Snackbar {...props}>
    <Box>
      <Stack spacing={1}>{props.children}</Stack>
    </Box>
  </Snackbar>
))<SnackStyledProps>({
  position: "absolute",
});
//!SECTION

//SECTION - Type Menu
type TypeMenuProps = Omit<SnackbarProps, "onChange"> & {
  onChange?: (type: Map["type"]) => void;
};
const TypeMenu = ({ onChange, ...props }: TypeMenuProps) => {
  const handleChange = (value: Map["type"]) => () => onChange?.(value);
  return (
    <SnackStyled {...props}>
      <Box>
        <Stack direction="column" spacing={1}>
          <Fab size="small" color="primary" onClick={handleChange("marker")}>
            <PickIcon icon="map-marker-alt" />
          </Fab>
          <Fab size="small" color="primary" onClick={handleChange("route")}>
            <PickIcon icon="route" />
          </Fab>
          <Fab size="small" color="primary" onClick={handleChange("area")}>
            <PickIcon icon="draw-polygon" />
          </Fab>
        </Stack>
      </Box>
    </SnackStyled>
  );
};
//!SECTION

//SECTION - InnerMap
const InnerMap = (props: {
  children?: ReactNode;
  onClick?: (event: LeafletMouseEvent) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    map.addEventListener("click", (e) => {
      props.onClick?.(e);
    });
    return () => {
      map.removeEventListener("click");
    };
  }, [map, props]);

  return (
    <Fragment>
      <TileLayer
        attribution='&copy; <a href="https://www.google.com/help/terms_maps/" target="_blank">Google Maps</a>'
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />
      {props.children}
    </Fragment>
  );
};
//!SECTION

//SECTION - MapItem
type MapItemProps = {
  data: Map;
  dragable?: boolean;
};
const MapItem = (props: MapItemProps) => {
  switch (props.data.type) {
    case "marker":
      return (
        <Marker
          position={props.data.latLng}
          draggable={props.dragable}
          icon={props.data.getIcon()}
        />
      );
    default:
      return null;
  }
};
//!SECTION

//SECTION - MarkerCatSelect
const MarkerCatSelect = (props: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const { t } = useCore();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const getIcon = useCallback((): PickIconName => {
    if (props.value && MarkerCatDict?.[props.value]) {
      return MarkerCatDict[props.value].icon;
    }
    return "question";
  }, [props.value]);
  const getColor = useCallback((): string => {
    if (props.value && MarkerCatDict?.[props.value]) {
      return MarkerCatDict[props.value].color ?? "#000000";
    }
    return "#000000";
  }, [props.value]);
  const handleToggle = (e: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChange = (value: string) => () => {
    props.onChange?.(value);
    handleClose()
  }

  return (
    <>
      <Tooltip title={t("Categories")} placement="right-end">
        <Fab
          size="small"
          onClick={handleToggle}
          sx={(t) => ({
            backgroundColor: getColor(),
            color: t.palette.getContrastText(getColor()),
            "&:hover": {
              backgroundColor: darken(getColor(), 0.25),
            },
          })}
        >
          <PickIcon icon={getIcon()} />
        </Fab>
      </Tooltip>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            padding: 1,
          },
        }}
      >
        <Grid container spacing={1} sx={{ width: 288 }}>
          {MarkerCat.map((item) => (
            <Grid item xs={2} key={item.id}>
              <Fab
                size="small"
                sx={(t) => ({
                  backgroundColor: item.color,
                  color: t.palette.getContrastText(item.color),
                  "&:hover": {
                    backgroundColor: darken(item.color, 0.25),
                  },
                })}
                onClick={handleChange(item.id)}
              >
                <PickIcon icon={item.icon} />
              </Fab>
            </Grid>
          ))}
        </Grid>
      </Menu>
    </>
  );
};
//!SECTION

export const LeafletEdit = () => {
  const [state, setState] = useState<{
    editor: null | Map;
  }>({
    editor: null,
  });

  const handleChangeType = (type: Map["type"]) =>
    setState((s) => ({ ...s, editor: new Map({ type }) }));
  const handleMapClick = (e: LeafletMouseEvent) => {
    if (state.editor?.type === "marker") {
      const { lat, lng } = e.latlng;
      setState((s) => ({
        ...s,
        editor: s.editor?.set("latLng", { lat, lng }) ?? null,
      }));
    }
  };

  return (
    <DialogCompact maxWidth="md" open title="Maps" icon="route">
      <Root>
        <MapContainer
          center={{ lat: 13.74574175868472, lng: 100.50150775714611 }}
          zoom={13}
        >
          <InnerMap onClick={handleMapClick}>
            {state.editor && <MapItem data={state.editor} dragable />}
          </InnerMap>
        </MapContainer>
        <TypeMenu open={state.editor === null} onChange={handleChangeType} />
        <SnackStyled open>
          <MarkerCatSelect
            value={state.editor?.cat}
            onChange={(value) =>
              setState((s) => ({
                ...s,
                editor: s.editor?.set("cat", value) ?? null,
              }))
            }
          />
        </SnackStyled>
      </Root>
    </DialogCompact>
  );
};
