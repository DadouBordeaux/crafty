import { createMessageFixtures, MessagingFixtures } from "./messaging.fixtures";
import { messageBuilder } from "./message.builder";
import {} from "../application/use_case/post_message.usecase";
import { EmptyMessageError, MessageTooLongError } from "../domain/message";

describe("Editing message", function() {
  let fixture: MessagingFixtures;
  beforeEach(() => {
    fixture = createMessageFixtures();
  });

  describe("Rule the edited text should not be superior to 280 characters", function() {
    test("Alice cannot edit a message with more than 280 characters", async function() {
      const messageId = "messageId";
      const messageWith281Characters = "a".repeat(281);
      const baseMessageBuilder = messageBuilder()
        .withId(messageId)
        .withPublishedAt(new Date(2023, 1, 9, 18, 57, 20));

      fixture.givenTheFollowingMessagesExists([
        baseMessageBuilder.withText("Hello wrld").build()
      ]);

      await fixture.whenUserEditsMessage({
        messageId: messageId,
        text: messageWith281Characters
      });

      await fixture.thenMessageShouldBe(
        baseMessageBuilder.withText("Hello wrld").build()
      );

      fixture.thenErrorShouldBe(MessageTooLongError);
    });
    test("Alice cannot edit a message to an empty text", async function() {
      const messageId = "messageId";
      const emptyMessage = "";
      const baseMessageBuilder = messageBuilder()
        .withId(messageId)
        .withPublishedAt(new Date(2023, 1, 9, 18, 57, 20));

      fixture.givenTheFollowingMessagesExists([
        baseMessageBuilder.withText("Hello world").build()
      ]);

      await fixture.whenUserEditsMessage({
        messageId: messageId,
        text: emptyMessage
      });

      await fixture.thenMessageShouldBe(
        baseMessageBuilder.withText("Hello world").build()
      );

      fixture.thenErrorShouldBe(EmptyMessageError);
    });
  });
});
