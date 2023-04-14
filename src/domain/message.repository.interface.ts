import { Message } from "./message";

export interface MessageRepository {
  messages: Map<string, Message>;

  save(message: Message): Promise<void>;

  getAllOfUser(user: string): Promise<Message[]>;

  getById(id: string): Message;
}
