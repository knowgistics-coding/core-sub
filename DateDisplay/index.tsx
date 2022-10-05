import { Box } from "@mui/material";
import moment from "moment";
import { PickIcon } from "../PickIcon";

export type DateDisplayProps = {
  date?: any
};

export const DateDisplay = (props: DateDisplayProps): JSX.Element => {
  const getDate = (): number | null => {
    if (props.date instanceof Date) {
      return props.date.getTime();
    } else if (typeof props.date === "number") {
      return props.date;
    } else if (props.date?.toMillis) {
      return props.date.toMillis();
    } else if(typeof props.date?._seconds === "number") {
      return props.date?._seconds * 1000
    } else {
      return null;
    }
  };

  return getDate() ? (
    <>
      <PickIcon
        icon={"calendar"}
        style={{ marginRight: "0.5rem" }}
      />
      {moment(getDate()).format("LL")}
      <Box display="inline-block" sx={{ px: 1 }}>
        |
      </Box>
      <PickIcon
        icon={"clock"}
        style={{ marginRight: "0.5rem" }}
      />
      {moment(getDate()).format("LT")}
    </>
  ) : (
    <></>
  );
};
