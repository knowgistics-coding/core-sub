import { Box } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { PickIcon } from "../PickIcon";

export type DateDisplayProps = {
  date?: Date | Timestamp | number
};

export const DateDisplay = (props: DateDisplayProps): JSX.Element => {
  const getDate = (): number | null => {
    if (props.date instanceof Date) {
      return props.date.getTime();
    } else if (typeof props.date === "number") {
      return props.date;
    } else if (props.date instanceof Timestamp) {
      return props.date.toMillis();
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
