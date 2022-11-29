import {
  Alert,
  AlertProps,
  Avatar,
  Box,
  Snackbar,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { genKey } from "draft-js";
import { useCallback, useEffect } from "react";
import { useCore } from "../context";

//SECTION - NotiState

//ANCHOR - NotiStateItem
export type NotiStateItem = Record<
  "key" | "name" | "picture" | "message",
  string
>;

//ANCHOR - NotiAction
export type NotiAction =
  | { type: "add"; value: Omit<NotiStateItem, "key"> }
  | { type: "remove"; value: string };

//ANCHOR - NotiState
export class NotiState {
  items: NotiStateItem[];

  //ANCHOR - constructor
  constructor(data?: Partial<NotiState>) {
    this.items = data?.items ?? [];
  }

  //ANCHOR - add
  add(item: Omit<NotiStateItem, "key">): this {
    this.items = this.items.concat({ ...item, key: genKey() });
    return this;
  }

  //ANCHOR - remove
  remove(key: string): this {
    this.items = this.items.filter((item) => item.key !== key);
    return this;
  }

  //SECTION - STATIC
  //ANCHOR - reducer
  static reducer(state: NotiState, action: NotiAction): NotiState {
    switch (action.type) {
      case "add":
        return new NotiState(state.add(action.value));
      case "remove":
        return new NotiState(state.remove(action.value));
      default:
        return state;
    }
  }
  //!SECTION
}
//!SECTION

//SECTION - Alerter
const AlertItem = styled(
  ({ item, ...props }: AlertProps & { item: NotiStateItem }) => {
    const { setNoti } = useCore();

    const handleRemove = useCallback(() => {
      setNoti({ type: "remove", value: item.key });
    }, [item, setNoti]);

    useEffect(() => {
      setTimeout(() => {
        handleRemove();
      }, 5000);
    }, [handleRemove]);

    return (
      <Alert
        {...props}
        variant="filled"
        color="info"
        icon={
          <Avatar
            variant="square"
            src={item.picture}
            sx={{ width: 36, height: 36 }}
          />
        }
        onClose={handleRemove}
        sx={{ alignItems: "center", width: "36ch", py: 0 }}
      >
        <Typography variant="body2" fontWeight="bold">
          {item.name}
        </Typography>
        <Typography variant="caption">{item.message}</Typography>
      </Alert>
    );
  }
)({});

//SECTION - Noti
export const Noti = () => {
  const { noti } = useCore();

  return (
    <>
      <Snackbar open={noti.items.length > 0}>
        <Box>
          <Stack spacing={1}>
            {noti.items.map((item) => (
              <AlertItem item={item} />
            ))}
          </Stack>
        </Box>
      </Snackbar>
    </>
  );
};
//!SECTION
