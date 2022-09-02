export function fitThailand(google: any, map: any) {
  const bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(20.67093604395338, 97.29951682397451),
    new google.maps.LatLng(5.6290204418308365, 105.44833030052126)
  );
  map.fitBounds(bounds);
}
