import {
    EmptyMessageError,
    MessageTooLongError,
    PostMessageCommand,
    PostMessageCommandUseCase,
} from "../post_message.usecase";
import {InMemoryMessageRepository} from "../message.in_memory";
import {StubDateProvider} from "../stub_date_provider";
import {Message} from "../message";

describe("Feature posting message", () => {
    let fixture: Fixture;

    beforeEach(() => {
        fixture = createFixture();
    });

    describe("Rule: Posting a message", function () {
        test("Alice can post a message", async function () {
            fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));
            await fixture.whenUserPostsMessage({
                id: "messageId",
                text: "Hello world",
                author: "alice",
            });

            fixture.thenPostedMessageShouldBe({
                id: "messageId",
                text: "Hello world",
                author: "alice",
                publishedAt: new Date(2023, 1, 9, 19, 0, 0),
            });
        });
        test("A message can contain a maximum of 280 characters", async function () {
            const textWithLength281 = "a".repeat(281);

            fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

            await fixture.whenUserPostsMessage({
                id: "messageId",
                text: textWithLength281,
                author: "alice",
            });

            fixture.thenErrorShouldBe(MessageTooLongError);
        });
    });

    describe("Rule: A message cannot be empty", function () {
        test("Alice cannot post a empty message", async function () {
            fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

            await fixture.whenUserPostsMessage({
                id: "messageId",
                text: "",
                author: "alice",
            });

            fixture.thenErrorShouldBe(EmptyMessageError);
        });

        test("Alice cannot post a message with only white spaces", async function () {
            fixture.givenNowIs(new Date(2023, 1, 9, 19, 0, 0));

            await fixture.whenUserPostsMessage({
                id: "messageId",
                text: "",
                author: "alice",
            });

            fixture.thenErrorShouldBe(EmptyMessageError);
        });
    });
});

const createFixture = () => {
    let thrownError: Error;
    let message: Map<string, Message>;
    const dateProvider = new StubDateProvider();
    const messageRepository = new InMemoryMessageRepository();

    const postMessageCommandUseCase = new PostMessageCommandUseCase(
        messageRepository,
        dateProvider
    );

    return {
        givenNowIs: (now: Date) => {
            dateProvider.now = now;
        },

        async whenUserPostsMessage(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageCommandUseCase.handle(postMessageCommand);
            } catch (error) {
                thrownError = error;
            }
        },
        thenPostedMessageShouldBe: (expectedMessage: Message) => {
            message = messageRepository.messages;
            expect(expectedMessage).toEqual(
                messageRepository.getMessageById("messageId")
            );
        },
        thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        },
    };
};

type Fixture = ReturnType<typeof createFixture>;
