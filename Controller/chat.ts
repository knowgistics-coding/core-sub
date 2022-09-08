// import { User } from "firebase/auth";
import { io, Socket } from "socket.io-client";
// import { SkeMongo, Options } from "./ske";
import { SkeMongo } from "./ske";

export type Unwatch = () => void;
export type GetIdResult = { error?: Error; id?: string };

export type Message = {
  type: "text";
  text?: string;
};
export type Payload = {
  chatId: string;
  message: Message;
};

type UserMini = {
  email: string;
  photoURL?: string;
  displayName?: string;
};
export type UserLists = Record<string, UserMini>;

export interface MessageDocument {
  _id: string;
  sender: string;
  chatId: string;
  timestamp: number;
  member: string[];
  type: "message";
  content: {
    _id: string;
    type: "text";
    text?: string;
  };
}

export class ChatSocket extends SkeMongo {
  readonly room = {
    list: () => {
      
    }
  }

  async open(friendUid: string): Promise<string> {
    const chatId = await this.get<string>(
      `${this.baseUrl}/chat/open/${friendUid}`,
      "GET"
    );
    return chatId;
  }

  async init(socket: Socket, room: string) {
    socket.emit("initChat", room);
  }

  async connect(): Promise<Socket> {
    const token = await this.user.getIdToken();
    const socket = io(`${this.baseUrl}`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return socket;
  }

  async push(socket: Socket, chatId: string, msg: Message) {
    const payload: Payload = { chatId, message: msg };
    socket.emit("msgToServer", payload);
  }

  async loadmore(room: string, last: Date): Promise<MessageDocument[]> {
    const messages = await this.get<MessageDocument[]>(
      `${this.baseUrl}/chat/loadmore`,
      "POST",
      JSON.stringify({
        room,
        last,
      })
    );
    return messages;
  }
}
