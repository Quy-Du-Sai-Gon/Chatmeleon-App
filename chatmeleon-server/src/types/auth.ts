import { ChatTokenPayload } from "@chatmeleon-app/types/auth";
export { ChatTokenPayload };

export const isChatTokenPayload = (obj: any): obj is ChatTokenPayload =>
  obj && typeof obj.userId === "string";
