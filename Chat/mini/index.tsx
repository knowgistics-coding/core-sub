import * as React from "react";
import {
  Avatar,
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Slide,
  styled,
} from "@mui/material";
import { useCore } from "../../context";
import { ChatSocket, MessageDocument, UserLists } from "../../Controller";
import { Socket } from "socket.io-client";
import { ChatContent, ChatItem, ChatItemTextPrimary } from "./content";
import { Root } from "./root";
import { ChatActions } from "./actions";
import { TextFieldSmall } from "./field";
import { ActionIcon } from "../../ActionIcon";
import { ChatHead } from "./head";

export const ChatContainer = styled(Box)({
  position: "fixed",
  bottom: 0,
  right: 24,
  overflow: "visible",
});

const defaultState = {
  loading: true,
  lastmessage: true,
  control: null,
  socket: null,
  messages: [],
  users: {},
};

export interface ChatMiniProps {
  chatId: string;
  onClose: () => void;
}
export const ChatMini = ({ chatId, onClose }: ChatMiniProps) => {
  const { user } = useCore();
  const [state, setState] = React.useState<{
    loading: boolean;
    lastmessage: boolean;
    control: ChatSocket | null;
    socket: Socket | null;
    messages: MessageDocument[];
    users: UserLists;
  }>({ ...defaultState });
  const [value, setValue] = React.useState<string>("");

  const handlePush = () => {
    if (state.control && state.socket && value) {
      state.control?.push(state.socket, chatId, { type: "text", text: value });
      setValue("");
    }
  };
  const handleLoadMore = async () => {
    if (state.control) {
      const lastMessage = state.messages[0];
      const last = new Date(0);
      last.setUTCMilliseconds(lastMessage.timestamp);
      const newmsgs = await state.control.loadmore(chatId, last);
      if (newmsgs.length) {
        const msgs = state.messages
          .concat(...newmsgs)
          .filter(
            (msg, i, msgs) => msgs.findIndex((m) => m._id === msg._id) === i
          )
          .sort((a, b) => a.timestamp - b.timestamp);
        setState((s) => ({
          ...s,
          messages: msgs,
          lastmessage: newmsgs.length < 10,
        }));
      }
    }
  };

  const handleClose = () => {
    state.socket?.off();
    state.socket?.disconnect();
    onClose();
  };

  React.useEffect(() => {
    if (user.loading === false && user.data && chatId) {
      const control = new ChatSocket(user.data);
      control
        .connect()
        .then((socket) =>
          setState((s) => ({ ...s, loading: false, control, socket }))
        );
    } else {
      setState({ ...defaultState });
    }
  }, [user, chatId]);

  React.useEffect(() => {
    if (state.socket && state.control && chatId) {
      state.control.init(state.socket, chatId);
      state.socket.on(
        chatId,
        (data: { users: UserLists; messages: MessageDocument[] }) => {
          setState((s) => {
            const messages = s.messages
              .concat(...data.messages)
              .filter(
                (msg, i, msgs) => msgs.findIndex((m) => m._id === msg._id) === i
              )
              .sort((a, b) => a.timestamp - b.timestamp);
            return {
              ...s,
              users: data.users || s.users,
              messages,
              lastmessage: messages.length < 10,
            };
          });
        }
      );
      return () => {
        state.socket?.off(chatId);
        state.socket?.disconnect();
      };
    } else {
      setState({ ...defaultState });
    }
  }, [state.control, state.socket, chatId]);

  return (
    <Slide direction="up" in={!state.loading}>
      <Root>
        <ChatHead users={state.users} onClose={handleClose} />
        <ChatContent>
          <Box>
            <List dense disablePadding>
              {state.lastmessage === false && (
                <ListItemButton
                  dense
                  divider
                  sx={{ "& .MuiListItemText-dense": { margin: 0 } }}
                  onClick={handleLoadMore}
                >
                  <ListItemText
                    primary={"Load more"}
                    primaryTypographyProps={{
                      variant: "caption",
                      color: "textSecondary",
                    }}
                  />
                </ListItemButton>
              )}
              {state.messages.map((message, index, msgs) => (
                <ChatItem divider={msgs.length - 1 !== index} key={message._id}>
                  <ListItemAvatar>
                    <Avatar src={state?.users?.[message.sender]?.photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <ChatItemTextPrimary
                        uid={message.sender}
                        displayName={
                          state?.users?.[message.sender]?.displayName
                        }
                        timestamp={message.timestamp}
                      />
                    }
                    secondary={message.content.text}
                    primaryTypographyProps={{ variant: "caption" }}
                    secondaryTypographyProps={{ variant: "body2" }}
                  />
                </ChatItem>
              ))}
            </List>
          </Box>
        </ChatContent>
        <ChatActions>
          <TextFieldSmall
            fullWidth
            name="message"
            value={value}
            onChange={({ target: { value } }) => setValue(value)}
            onKeyDown={({ key }) => key === "Enter" && handlePush()}
            inputProps={{ placeholder: "Aa" }}
          />
          <ActionIcon icon={"paper-plane"} disabled={!Boolean(value)} />
        </ChatActions>
      </Root>
    </Slide>
  );
};
