import { InMemoryMessageRepository } from "../message.in_memory";
import { ViewTimelineUseCase } from "../view_timeline.usecase";
import { Message } from "../message";
import { StubDateProvider } from "../stub_date_provider";

describe("Feature: Viewing a personal timeline", function () {
  let fixture: Fixture;
  beforeEach(() => {
    fixture = createFixture();
  });

  describe("Rule: Message are show in reverse chronological order", function () {
    test("Alice can see the 2 message she published in her personal timeline", async function () {
      fixture.givenTheFollowingMessagesExists([
        {
          author: "Alice",
          text: "My first message",
          id: "messageId1",
          publishedAt: new Date(2023, 1, 9, 18, 57, 20),
        },
        {
          author: "Alice",
          text: "My second message",
          id: "messageId2",
          publishedAt: new Date(2023, 1, 9, 18, 59, 0),
        },
        {
          author: "Bob",
          text: "A message",
          id: "messageId3",
          publishedAt: new Date(2023, 1, 9, 16, 0, 0),
        },
        {
          author: "Alice",
          text: "My last message",
          id: "messageId4",
          publishedAt: new Date(2023, 1, 9, 18, 59, 31),
        },
      ]);

      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserViewsTimelineOf("Alice");

      fixture.thenUserShouldSeeTheFollowingMessagesInTimeline([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "less than a minute ago",
        },
        {
          author: "Alice",
          text: "My second message",
          publicationTime: "1 minute ago",
        },
        {
          author: "Alice",
          text: "My first message",
          publicationTime: "2 minutes ago",
        },
      ]);
    });
  });
});

const createFixture = () => {
  let timeline: { author: string; text: string; publicationTime: string }[] =
    [];
  const messageRepository = new InMemoryMessageRepository();
  const stubDateProvider = new StubDateProvider();
  const viewTimeLineUseCase = new ViewTimelineUseCase(
    messageRepository,
    stubDateProvider
  );

  return {
    givenTheFollowingMessagesExists: (messages: Message[]) => {
      messageRepository.givenMessages(messages);
    },
    givenNowIs: (now: Date) => {
      stubDateProvider.now = now;
    },
    async whenUserViewsTimelineOf(user: string) {
      timeline = await viewTimeLineUseCase.handle({ user });
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
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
