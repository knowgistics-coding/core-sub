import { User } from "firebase/auth";
import { io, Socket } from "socket.io-client";

export class ChatAuth {
  uid: string;
  name: string;
  picture: string;

  constructor(data?: Partial<ChatAuth>) {
    this.uid = data?.uid ?? "";
    this.name = data?.name ?? "";
    this.picture = data?.picture ?? "";
  }
}

export class Room {
  _id: string;
  members: Record<string, ChatAuth>;
  type: "room";

  constructor(data?: Partial<Room>) {
    this._id = data?._id ?? "";
    this.members = Object.assign(
      {},
      ...Object.entries(data?.members ?? {}).map(([uid, data]) => ({
        [uid]: new ChatAuth(data),
      }))
    );
    this.type = data?.type ?? "room";
  }

  getName(user: User): { name: string; picture: string[] } {
    const users = Object.values(this.members).filter(
      (member) => member.uid! === user.uid
    );
    return {
      name: users.map((u) => u.name).join(", "),
      picture: users.map((u) => u.picture).filter((u) => u),
    };
  }
}

export class ChatRoom {
  constructor(private socket: Socket, private room: Room) {}

  disconnect() {
    this.socket.disconnect();
  }

  static async watch(
    user: User,
    friendUid: string,
    callback: (room: ChatRoom) => void
  ) {
    const token = await user.getIdToken();
    const socket = io("http://localhost:8080", {
      extraHeaders: {
        friendUid,
        Authorization: `Bearer ${token}`,
      },
    });
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("receive", (data) => {
      const room = new ChatRoom(socket, new Room(data));
      console.log(room);
      callback(room)
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  }
}
