import {MessageRepository} from "./message.repository.interface";


export type PostMessageCommand = { id: string; text: string; author: string };


export class PostMessageCommandUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
    ) {
    }

    async handle(postMessageCommand: PostMessageCommand) {
        if (postMessageCommand.text.length > 280) {
            throw new MessageTooLongError();
        }

        if (postMessageCommand.text.trim().length === 0) {
            throw new EmptyMessageError();
        }

        await this.messageRepository.save({
            id: postMessageCommand.id,
            text: postMessageCommand.text,
            author: postMessageCommand.author,
            publishedAt: this.dateProvider.getNow(),
        });
    }
}

export interface DateProvider {
    getNow(): Date;
}

export class MessageTooLongError extends Error {
}

export class EmptyMessageError extends Error {
}
