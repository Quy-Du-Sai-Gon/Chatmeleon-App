import { ChatTokenPayload as ChatTokenPayloadType } from "@chatmeleon-app/types/auth";
export { ChatTokenPayloadType };

import { z } from "zod";
import { ObjectIdString } from "@/validation";

export const ChatTokenPayload = z.object({ userId: ObjectIdString });
