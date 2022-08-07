import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import moment from "moment";

export type DateDisplayProps = {
  date?: any;
};

export const DateDisplay = (props: DateDisplayProps): JSX.Element => {
  const getDate = (): number | null => {
    if (props.date instanceof Date) {
      return props.date.getTime();
    } else if (typeof props.date === "number") {
      return props.date;
    } else if (props.date?.toMillis) {
      return props.date.toMillis();
    } else {
      return null;
    }
  };

  return getDate() ? (
    <>
      <FontAwesomeIcon
        icon={["far", "calendar"]}
        style={{ marginRight: "0.5rem" }}
      />
      {moment(getDate()).format("LL")}
      <Box display="inline-block" sx={{ px: 1 }}>
        |
      </Box>
      <FontAwesomeIcon
        icon={["far", "clock"]}
        style={{ marginRight: "0.5rem" }}
      />
      {moment(getDate()).format("LT")}
    </>
  ) : (
    <></>
  );
};
