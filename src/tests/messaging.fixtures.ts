import { Message } from "../domain/message";
import { StubDateProvider } from "../infra/stub_date_provider";
import { InMemoryMessageRepository } from "../infra/message.in_memory";
import {
  PostMessageCommand,
  PostMessageCommandUseCase
} from "../application/use_case/post_message.usecase";
import { ViewTimelineUseCase } from "../application/use_case/view_timeline.usecase";
import {
  EditMessageCommand,
  EditMessageUseCase
} from "../application/use_case/edit_message.usecase";

export const createMessageFixtures = () => {
  let thrownError: Error;
  let message: Map<string, Message>;
  let timeline: { author: string; text: string; publicationTime: string }[] =
    [];
  const dateProvider = new StubDateProvider();
  const messageRepository = new InMemoryMessageRepository();

  const postMessageCommandUseCase = new PostMessageCommandUseCase(
    messageRepository,
    dateProvider
  );

  const viewTimeLineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider
  );

  const editMessageUseCase = new EditMessageUseCase(messageRepository);

  return {
    givenNowIs: (now: Date) => {
      dateProvider.now = now;
    },

    thenMessageShouldBe: async (expectedMessage: Message) => {
      const message = await messageRepository.getById(expectedMessage.id);
      expect(expectedMessage).toEqual(message);
    },
    thenErrorShouldBe(expectedErrorClass: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedErrorClass);
    },

    givenTheFollowingMessagesExists: (messages: Message[]) => {
      messageRepository.givenMessages(messages);
    },

    async whenUserPostsMessage(postMessageCommand: PostMessageCommand) {
      try {
        await postMessageCommandUseCase.handle(postMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },
    async whenUserViewsTimelineOf(user: string) {
      timeline = await viewTimeLineUseCase.handle({ user });
    },

    async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
      try {
        await editMessageUseCase.handle(editMessageCommand);
      } catch (error) {
        thrownError = error;
      }
    },

    thenUserShouldSeeTheFollowingMessagesInTimeline: (
      expectedTimeline: {
        author: string;
        text: string;
        publicationTime: string;
      }[]
    ) => {
      expect(timeline.length).toBe(3);
      expect(timeline).toEqual(expectedTimeline);
    }
  };
};

export type MessagingFixtures = ReturnType<typeof createMessageFixtures>;
