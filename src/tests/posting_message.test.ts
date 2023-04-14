import { EmptyMessageError, Message, MessageTooLongError } from "../domain/message";
import { createMessageFixtures, MessagingFixtures } from "./messaging.fixtures";
import { messageBuilder } from "./message.builder";

describe("Feature posting message", () => {
  let fixture: MessagingFixtures;

  beforeEach(() => {
    fixture = createMessageFixtures();
  });

  describe("Rule: Posting a message", function() {
    test("Alice can post a message", async function() {
      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserPostsMessage({
        id: "messageId",
        text: "Hello world",
        author: "Alice"
      });

      await fixture.thenMessageShouldBe(
        messageBuilder()
          .withId("messageId")
          .withAuthor("Alice")
          .withText("Hello world")
          .withPublishedAt(new Date(2023, 1, 9, 19, 0, 0))
          .build()
      );
    });
    test("A message can contain a maximum of 280 characters", async function() {
      const textWithLength281 = "a".repeat(281);

      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserPostsMessage({
        id: "messageId",
        text: textWithLength281,
        author: "alice"
      });

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
  });

  describe("Rule: A message cannot be empty", function() {
    test("Alice cannot post a empty message", async function() {
      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserPostsMessage({
        id: "messageId",
        text: "",
        author: "alice"
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });

    test("Alice cannot post a message with only white spaces", async function() {
      fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

      await fixture.whenUserPostsMessage({
        id: "messageId",
        text: "",
        author: "alice"
      });

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
