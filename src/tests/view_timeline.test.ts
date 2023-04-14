import { InMemoryMessageRepository } from "../infra/message.in_memory";
import { ViewTimelineUseCase } from "../application/use_case/view_timeline.usecase";
import { Message } from "../domain/message";
import { StubDateProvider } from "../infra/stub_date_provider";
import { createMessageFixtures, MessagingFixtures } from "./messaging.fixtures";
import { messageBuilder } from "./message.builder";

describe("Feature: Viewing a personal timeline", function() {
  let fixture: MessagingFixtures;
  beforeEach(() => {
    fixture = createMessageFixtures();
  });

  describe("Rule: Message are show in reverse chronological order", function() {
    test("Alice can see the 2 message she published in her personal timeline", async function() {
      const aliceMessageBuilder = messageBuilder().withAuthor("Alice");
      const bobMessageBuilder = messageBuilder().withAuthor("Bob");
      fixture.givenTheFollowingMessagesExists([
        aliceMessageBuilder
          .withText("My first message")
          .withId("messageId1")
          .withPublishedAt(new Date(2023, 1, 9, 18, 57, 20))
          .build(),
        aliceMessageBuilder
          .withText("My second message")
          .withId("messageId2")
          .withPublishedAt(new Date(2023, 1, 9, 18, 59, 0))
          .build(),

        aliceMessageBuilder
          .withText("My last message")
          .withId("messageId4")
          .withPublishedAt(new Date(2023, 1, 9, 18, 59, 31))
          .build(),
        bobMessageBuilder
          .withId("messageId3")
          .withText("A message")
          .withPublishedAt(new Date(2023, 1, 9, 16, 0, 0))
          .build()
      ]);

      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserViewsTimelineOf("Alice");

      fixture.thenUserShouldSeeTheFollowingMessagesInTimeline([
        {
          author: "Alice",
          text: "My last message",
          publicationTime: "less than a minute ago"
        },
        {
          author: "Alice",
          text: "My second message",
          publicationTime: "1 minute ago"
        },
        {
          author: "Alice",
          text: "My first message",
          publicationTime: "2 minutes ago"
        }
      ]);
    });
  });
});
