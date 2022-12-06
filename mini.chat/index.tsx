import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import ActionIcon from "../ActionIcon";
import { useCore } from "../context";
import { ChatRoom, MessagePayload } from "../Controller";
import { Time } from "../Controller/time";
import { User } from "../Controller/user";
import { ChatBox } from "./chatbox";

//SECTION - MiniChatCtl
type MiniChatAction =
  | { type: "update"; value: any }
  | { type: "open"; value: string }
  | { type: "hide"; value: string }
  | { type: "socket"; value: Socket }
  | { type: "setusers"; value: Record<string, User> }
  | { type: "set_room"; value: ChatRoom }
  | { type: "push_message"; value: MessagePayload }
  | { type: "shift_message"; value: MessagePayload[] }
  | { type: "room_disconnect" };
export class MiniChatState {
  //ANCHOR - VALUE
  uid: string;
  hide: Record<string, boolean>;
  users: Record<string, User>;
  socket: Socket | null;
  chatroom: ChatRoom | null;

  //ANCHOR - constructor
  constructor(data?: Partial<MiniChatState>) {
    this.uid = data?.uid ?? "";
    this.users = data?.users ?? {};
    this.hide = data?.hide ?? {};
    this.socket = data?.socket ?? null;
    this.chatroom = data?.chatroom ?? null;
  }

  set<T extends keyof this>(
    field: T,
    value: this[T] | ((data: this[T]) => this[T])
  ): this {
    this[field] = value instanceof Function ? value(this[field]) : value;
    return this;
  }

  //ANCHOR - open
  open(uid: string): this {
    if (this.uid === uid) {
      this.uid = "";
    } else {
      this.uid = uid;
    }
    return this;
  }

  //ANCHOR - setusers
  setusers(users: Record<string, User>): this {
    this.users = Object.assign({}, this.users, users);
    return this;
  }

  //ANCHOR - setHide
  setHide(uid: string): this {
    this.hide[uid] = !Boolean(this.hide[uid]);
    return this;
  }

  //ANCHOR - roomDisconnect
  roomDisconnect(): this {
    if (this.chatroom) {
      this.chatroom.disconnect();
      this.chatroom = null;
    }
    return this;
  }

  //ANCHOR - reducer
  static reducer(state: MiniChatState, action: MiniChatAction): MiniChatState {
    switch (action.type) {
      case "open":
        return new MiniChatState(state.open(action.value));
      case "setusers":
        return new MiniChatState(state.setusers(action.value));
      case "hide":
        return new MiniChatState(state.setHide(action.value));
      case "socket":
        return new MiniChatState(state.set("socket", action.value));
      case "set_room":
        return new MiniChatState(state.set("chatroom", action.value));
      case "push_message":
        return new MiniChatState(
          state.set(
            "chatroom",
            (chatroom) => chatroom?.pushMessage(action.value) ?? null
          )
        );
      case "shift_message":
        return new MiniChatState(
          state.set(
            "chatroom",
            (chatroom) => chatroom?.shiftMessage(action.value) ?? null
          )
        );
      case "room_disconnect":
        return new MiniChatState(state.roomDisconnect());
      default:
        return state;
    }
  }
}
//!SECTION

//ANCHOR - Root
const Root = styled(Stack)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  right: theme.spacing(3),
}));
Root.defaultProps = {
  direction: "row",
  spacing: 2,
};

//ANCHOR - ChatContext
const ChatContext = createContext<{
  state: MiniChatState;
  dispatch: Dispatch<MiniChatAction>;
}>({
  state: new MiniChatState(),
  dispatch: () => {},
});

//SECTION - MiniChat
export const MiniChat = () => {
  const { user, t } = useCore();
  const { state, dispatch } = useContext(ChatContext);
  const [message, setMessage] = useState<{ loading: boolean; value: string }>({
    loading: false,
    value: "",
  });

  const handleOpen = (uid: string) => () =>
    dispatch({ type: "open", value: uid });
  const handleHide = (uid: string) => () =>
    dispatch({ type: "hide", value: uid });
  const handleSend = async () => {
    if (state.chatroom && user.data) {
      setMessage((s) => ({ ...s, loading: true }));
      await state.chatroom.sendMessage(user.data, message.value);
      setMessage((s) => ({ ...s, value: "", loading: false }));
    }
  };

  //SECTION - USEEFFECT
  useEffect(() => {
    if (user.loading === false && user.data && state.uid) {
      User.getUsersDict(user.data, [state.uid]).then((users) => {
        dispatch({ type: "setusers", value: users });
      });
    }
  }, [user, state.uid, dispatch]);

  useEffect(() => {
    if (user.loading === false && user.data && state.uid) {
      ChatRoom.watch(
        user.data,
        state.uid,
        (room) => {
          dispatch({ type: "set_room", value: room });
        },
        (messages) => {
          dispatch({ type: "shift_message", value: messages });
        },
        (message) => {
          dispatch({ type: "push_message", value: message });
        }
      );
      return () => dispatch({ type: "room_disconnect" });
    }
  }, [user, state.uid, dispatch]);
  //!SECTION

  //SECTION - RENDER
  return (
    <Root>
      {state.uid && state.users?.[state.uid] && (
        <ChatBox.Root key={state.uid}>
          <ChatBox.Head>
            <ChatBox.Avatar src={state.users[state.uid].photoURL} />
            <ChatBox.Name>{state.users[state.uid].displayName}</ChatBox.Name>
            <Box flex={1} />
            <ActionIcon
              icon="horizontal-rule"
              onClick={handleHide(state.uid)}
            />
            <ActionIcon
              color="error"
              icon="xmark"
              onClick={handleOpen(state.uid)}
            />
          </ChatBox.Head>
          <ChatBox.Body in={!Boolean(state.hide[state.uid])}>
            <Paper elevation={0}>
              <Stack direction={"column-reverse"} spacing={1} sx={{ p: 1 }}>
                {state.chatroom?.messages.map((msg, i) => (
                  <Box
                    key={msg.message.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.isYourMessage(user?.data)
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <Tooltip title={new Time(msg.timestamp).toShort()}>
                      <Chip
                        label={msg.message.text}
                        color={
                          msg.isYourMessage(user?.data) ? "primary" : "default"
                        }
                      />
                    </Tooltip>
                    {i === 0 && (
                      <Typography variant="caption" color="textSecondary" sx={{mt:0.5,pr:1}}>
                        {new Time(msg.timestamp).toShort()}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ p: 1 }}>
              <TextField
                fullWidth
                autoFocus
                size="small"
                value={message.value}
                onChange={({ target: { value } }) =>
                  setMessage((s) => ({ ...s, value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                    e.preventDefault();
                  }
                }}
                placeholder={t("Message")}
                disabled={message.loading}
              />
              <ActionIcon
                icon="paper-plane"
                onClick={handleSend}
                disabled={message.loading || !Boolean(message.value)}
              />
            </Stack>
          </ChatBox.Body>
        </ChatBox.Root>
      )}
    </Root>
  );
  //!SECTION
};
//!SECTION

export const withMiniChat =
  <T extends Record<string, unknown>>(
    Element: (
      props: T & { state: MiniChatState; dispatch: Dispatch<MiniChatAction> }
    ) => JSX.Element
  ) =>
  (props: T) => {
    const [state, dispatch] = useReducer(
      MiniChatState.reducer,
      new MiniChatState()
    );

    return (
      <ChatContext.Provider value={{ state, dispatch }}>
        <Element {...props} state={state} dispatch={dispatch} />
      </ChatContext.Provider>
    );
  };
