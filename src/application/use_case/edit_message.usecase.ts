import { MessageRepository } from "../../domain/message.repository.interface";
import { MessageText } from "../../domain/message";

export type EditMessageCommand = {
  messageId: string;
  text: string;
};

export class EditMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {
  }

  async handle(command: EditMessageCommand) {
    const message = this.messageRepository.getById(command.messageId);

    message.editText(command.text);
    await this.messageRepository.save(message);
  }
}
