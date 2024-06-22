import { SenderMessagePreview } from "./sender-message-preview";

export type MessagePreview = {
  body?: string;
  image?: string;
  createdAt: Date;
  sender: SenderMessagePreview;
};
