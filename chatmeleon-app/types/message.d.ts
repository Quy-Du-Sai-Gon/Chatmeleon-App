export type Message = BaseObject & {
  body?: string;
  image?: string;
  createdAt: Date;
  senderId: string;
};
