import { User } from "firebase/auth";
import { io, Socket } from "socket.io-client";
import { MainStatic } from "./main.static";
import { DateCtl } from "./date.ctl";

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

//SECTION - Target
export class Target {
  id: string;
  type: "user" | "room";

  constructor(data?: Partial<Target>) {
    this.id = data?.id ?? "";
    this.type = data?.type ?? "user";
  }
}
//!SECTION

//SECTION - Emoji
export class Emoji {
  index: number;
  length: number;
  productId: string;
  emojiId: string;

  constructor(data?: Partial<Emoji>) {
    this.index = data?.index ?? 0;
    this.length = data?.length ?? 0;
    this.productId = data?.productId ?? "1";
    this.emojiId = data?.productId ?? "1";
  }
}
//!SECTION

//SECTION - Mention
export class Mention {
  index: number;
  length: number;
  userId: string;

  constructor(data?: Partial<Mention>) {
    this.index = data?.index ?? 0;
    this.length = data?.length ?? 0;
    this.userId = data?.userId ?? "";
  }
}
//!SECTION

//SECTION - Message
export class Message {
  id: string;
  type: string;
  text: string;
  emojis: Emoji[];
  mention: Mention[];

  constructor(data?: Partial<Message>) {
    this.id = data?.id ?? "";
    this.text = data?.text ?? "";
    this.emojis = data?.emojis ?? [];
    this.mention = data?.mention ?? [];
    this.type = data?.type ?? "text";
  }
}
//!SECTION

//SECTION - MessagePayload
export class MessagePayload {
  type: "message" = "message";
  timestamp: number;
  source: ChatAuth;
  message: Message;
  target: Target;

  constructor(data?: Partial<MessagePayload>) {
    this.timestamp = DateCtl.toNumber(data?.timestamp);
    this.source = new ChatAuth(
      data?.source ?? { uid: "", name: "", picture: "" }
    );
    this.message = new Message(data?.message);
    this.target = new Target(data?.target);
  }

  isYourMessage(user?: User | null): boolean {
    if (user?.uid) {
      return user.uid === this.source.uid;
    }
    return false;
  }
}
//!SECTION

//SECTION - Room
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
//!SECTION

//SECTION - ChatRoom
export class ChatRoom {
  messages: MessagePayload[] = [];

  constructor(private socket: Socket, private room: Room) {}

  async sendMessage(user: User, value: string): Promise<void> {
    await MainStatic.get(
      user,
      `http://localhost:8080/chat/push/${this.room._id}`,
      "PUT",
      JSON.stringify({
        value,
        type: "message",
      })
    );
  }

  pushMessage(message: MessagePayload): this {
    this.messages = [message].concat(...this.messages);
    return this;
  }

  shiftMessage(messages: MessagePayload[]): this {
    this.messages = this.messages.concat(...messages);
    return this;
  }

  disconnect() {
    this.socket.disconnect();
  }

  static createMessage(data?: Record<string, any>) {
    const newData: MessagePayload = new MessagePayload({
      type: "message",
      timestamp: DateCtl.toNumber(data?.timestamp),
      source: new ChatAuth({
        uid: data?.source_uid,
        picture: data?.source_picture,
        name: data?.source_name,
      }),
      message: new Message({
        emojis: data?.message_emojis,
        id: data?.message_id,
        mention: data?.message_mension,
        text: data?.message_text,
        type: data?.message_type,
      }),
      target: new Target({ id: data?.target_id, type: data?.target_type }),
    });
    return newData;
  }

  static async watch(
    user: User,
    friendUid: string,
    callback: (room: ChatRoom) => void,
    onInit: (messages: MessagePayload[]) => void,
    onMessage: (message: MessagePayload) => void
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
      callback(room);
    });
    socket.on("receiveInit", (messages) => {
      const newMessages = Array.isArray(messages)
        ? messages.map((msg) => this.createMessage(msg))
        : [];
      onInit(newMessages);
    });
    socket.on("receiveMessage", (data) => {
      const payload = this.createMessage(data);
      onMessage(payload);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  }
}
//!SECTION
