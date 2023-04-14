import { MessageRepository } from "../../domain/message.repository.interface";
import { Message, MessageText } from "../../domain/message";
import { DateProvider } from "../../domain/date_provider";

export type PostMessageCommand = { id: string; text: string; author: string };

export class PostMessageCommandUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {
  }

  async handle(postMessageCommand: PostMessageCommand) {
    await this.messageRepository.save(
      Message.fromData({
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: this.dateProvider.getNow()
      })
    );
  }
}
