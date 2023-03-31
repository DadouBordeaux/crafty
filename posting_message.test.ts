describe("Feature posting message", () => {
    describe('Rule: A message can contain a maximum of 280 characters', function () {
        test('A message can contain a maximum of 280 characters', function () {
            givenNowIs(
                new Date(2023, 1, 9, 19, 0, 0)
            )


            whenUserPostsMessage({
                id: "messageId",
                text: "Hello world",
                author: "alice"
            })

            thenPostedMessageShouldBe({
                id: "messageId",
                text: "Hello world",
                author: "alice",
                publishedAt: new Date(2023, 1, 9, 19, 0, 0)
            })
        })
    });
})

let message: { id: string, author: string, text: string, publishedAt: Date }
let _now: Date

function givenNowIs(now: Date) {
    _now = now
}

function whenUserPostsMessage(postMessageCommand: { id: string, text: string, author: string }) {
    message = {
        id: postMessageCommand.id,
        text: postMessageCommand.text,
        author: postMessageCommand.author,
        publishedAt: new Date(2023, 1, 9, 19, 0, 0),
    }
}


function thenPostedMessageShouldBe(expectedMessage: { id: string, text: string, author: string, publishedAt: Date }) {
    expect(expectedMessage).toEqual(message)
}
