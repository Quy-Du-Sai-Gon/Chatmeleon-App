import { MessagePreview } from "./message-preview";

export type ConversationChatList = BaseObject & {
  name?: string;
  image?: string;
  isGroup: boolean;
  lastMessage?: MessagePreview;
};
