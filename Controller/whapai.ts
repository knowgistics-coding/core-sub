import { io, Socket } from "socket.io-client";
import { SkeMongo } from "./ske";

export type Online = Record<string, boolean>;
export interface UserMini {
  _id?: string;
  uid: string;
  displayName?: string;
  photoURL?: string;
  email: string;
}
export interface RoomData {
  _id: string;
  member: UserMini[];
  type: string;
}
export type WhapaiCallBack = Record<string, any>;

export type ChatError = null | { message: string };

export type WhapaiState = {
  loading: boolean;
  userdata?: {
    aid: string;
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    friends?: UserMini[];
  } | null;
};

export interface WhapaiMessage {
  _id: string;
  sender: UserMini
  room: string;
  timestamp: string;
  content: {
    type: string;
    text?: string;
  };
}

export class Whapai extends SkeMongo {
  socket?: Socket;

  async init(callback: (socket: Socket) => void) {
    const token = await this.user.getIdToken();
    this.socket = io(`${this.baseUrl}`, {
      path: "/chat/lobby",
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    callback(this.socket);
  }

  disconnect() {
    return () => {
      this.socket?.off();
      this.socket?.disconnect();
    };
  }
}

export class WhapaiRoom extends SkeMongo {
  socket?: Socket;

  init(roomId: string, callback: (socket: Socket) => void) {
    this.user.getIdToken().then((token) => {
      this.socket = io(`${this.baseUrl}`, {
        path: "/chat/room",
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.socket.emit(`init`, roomId);
      callback(this.socket);
    });
    return () => {
      this.socket?.off();
      this.socket?.disconnect();
    };
  }

  watch(
    roomId: string,
    callback: (err: ChatError, messages: WhapaiMessage[]) => void
  ) {
    this.socket?.on(
      `room-${roomId}`,
      (err: ChatError, messages: WhapaiMessage[]) => {
        callback(err, messages);
        console.log(messages);
      }
    );
    return () => this.socket?.off(`room-${roomId}`);
  }

  send(roomId: string, message: string) {
    this.socket?.emit("send", roomId, message);
  }

  disconnect() {
    this.socket?.off();
    this.socket?.disconnect();
  }
}
