export interface Event {
  type: string;
  message?: Message;
  timestamp: number;
  source: Source;
  replyToken?: string;
  mode: string;
  webhookEventId: string;
  deliveryContext: {
    isRedelivery: boolean;
  };
}

export interface Message {
  type: string;
  id: string;
  text: string;
}

export interface Source {
  type: string;
  groupId?: string;
  roomId?: string;
  userId: string;
}

export class LineMessage {
  destination: string;
  events: Event[];

  constructor(data?: Partial<LineMessage>) {
    this.destination = data?.destination ?? "";
    this.events = data?.events ?? [];
  }
}
