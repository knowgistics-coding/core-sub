import { Box } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateCtl } from "../Controller";
import { PickIcon } from "../PickIcon";
import "moment/locale/th";
import "moment/locale/en-gb";
import i18next from "i18next";

export type DateDisplayProps = {
  date?: Date | Timestamp | number;
  view?: number;
};

export const DateDisplay = (props: DateDisplayProps): JSX.Element => {
  const [state, setState] = useState<{ date: number }>({ date: Date.now() });
  const lang = i18next.language;
  const locale = lang.includes("th")
    ? "th"
    : ("en-gb" as moment.LocaleSpecifier);

  useEffect(() => {
    if (props.date) {
      setState((s) => ({ ...s, date: DateCtl.toNumber(props.date) }));
    }
  }, [props.date]);

  return (
    <>
      <PickIcon icon={"calendar"} style={{ marginRight: "0.5rem" }} />
      {moment(state.date).locale(locale).format("MMMM Do, YYYY")}
      <Box display="inline-block" sx={{ px: 1 }}>
        |
      </Box>
      <PickIcon icon={"clock"} style={{ marginRight: "0.5rem" }} />
      {moment(state.date).locale(locale).format("LT")}
      {typeof props.view === "number" && (
        <span>
          <PickIcon icon="eye" />
          {props.view}
        </span>
      )}
    </>
  );
};
