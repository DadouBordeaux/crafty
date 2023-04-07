import { MessageRepository } from "./message.repository.interface";
import { Message } from "./message";

export class InMemoryMessageRepository implements MessageRepository {
  messages = new Map<string, Message>([]);

  async save(msg: Message): Promise<void> {
    this.messages.set(msg.id, msg);
  }

  givenMessages(messages: Message[]) {
    messages.forEach((msg) => this.messages.set(msg.id, msg));
  }

  async getAllOfUser(user: string): Promise<Message[]> {
    return Promise.resolve(
      Array.from(this.messages.values()).filter((msg) => msg.author === user)
    );
  }

  getMessageById(id: string): Message {
    return this.messages.get(id);
  }
}
