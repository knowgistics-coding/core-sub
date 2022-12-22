import { forwardRef, RefAttributes } from "react";
import { Popup, PopupProps } from "react-leaflet";
import L from "leaflet";
import { Link, Typography } from "@mui/material";

export const PopupWithLatLng = forwardRef<
  L.Popup,
  PopupProps &
    RefAttributes<L.Popup> & {
      title: string;
      latLng?: Record<"lat" | "lng", number>;
    }
>(({ title, latLng, ...props }, ref) => {
  return (
    <Popup ref={ref} {...props}>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ pb: 1, margin: "0 !important" }}
      >
        {title}
      </Typography>
      {latLng && (
        <Link
          href={`https://www.google.com/maps/dir/Current+Location/${latLng.lat},${latLng.lng}`}
          target="_blank"
        >
          Open in Google Maps
        </Link>
      )}
    </Popup>
  );
});
