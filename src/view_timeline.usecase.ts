import { MessageRepository } from "./message.repository.interface";
import { DateProvider } from "./post_message.usecase";

const ONE_MINUTE_IN_SECONDS = 60000;

export class ViewTimelineUseCase {
  constructor(
    private messageRepository: MessageRepository,
    private readonly dateProvider: DateProvider
  ) {
  }

  async handle({ user }: { user: string }): Promise<any[]> {
    const messageOfUser = await this.messageRepository.getAllOfUser(user);
    return messageOfUser
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .map((msg) => {
        return {
          author: msg.author,
          text: msg.text,
          publicationTime: this.publicationTime(
            this.dateProvider.getNow(),
            msg.publishedAt
          )
        };
      });
  }

  private publicationTime = (now: Date, publishedDate: Date) => {
    const diff = now.valueOf() - publishedDate.valueOf();

    const minutes = Math.floor(diff / ONE_MINUTE_IN_SECONDS);

    if (minutes < 1) {
      return "less than a minute ago";
    }

    if (minutes < 2) {
      return "1 minute ago";
    }

    return `${minutes} minutes ago`;
  };
}
