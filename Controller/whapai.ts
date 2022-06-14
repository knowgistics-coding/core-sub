import { User } from "firebase/auth";
import { io, Socket } from "socket.io-client";
import { SkeMongo, Options } from "./ske";

export type Online = Record<string, boolean>;
export interface UserMini {
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
export interface WhapaiCallBack {
  online?: Online;
  rooms?: RoomData[];
}

export class Whapai extends SkeMongo {
  socket?: Socket;

  constructor(
    user: User,
    callback: (data: WhapaiCallBack) => void,
    options: Options
  ) {
    super(user, options);

    user.getIdToken().then((token) => {
      this.socket = io(`${this.baseUrl}`, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.socket.on("online", (online) => callback({ online }));
      this.socket.on("rooms", (rooms) => callback({ rooms }));
    });
  }

  watchMessage(
    roomId: string,
    callback: (messages?: any[], message?: any) => void
  ) {
    this.socket?.emit("watchroom", roomId);
    this.socket?.on(`room-${roomId}`, (messages?: any[], message?: any) => {
      callback(messages, message);
    });
    return () => this.socket?.off(`room-${roomId}`);
  }

  disconnect() {
    this.socket?.off();
    this.socket?.disconnect();
  }
}
