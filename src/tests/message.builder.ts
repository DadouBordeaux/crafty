import { Message, MessageText } from "../domain/message";

export const messageBuilder = ({
                                 id = "messageId",
                                 author = "Alice",
                                 text = "Hello world",
                                 publishedAt = new Date()
                               } = {}) => {
  const props = {
    id,
    author,
    text,
    publishedAt
  };
  return {
    withId: (_id: string) => messageBuilder({ ...props, id: _id }),
    withText: (_text: string) => messageBuilder({ ...props, text: _text }),
    withAuthor: (_author: string) =>
      messageBuilder({ ...props, author: _author }),
    withPublishedAt: (_publishedAt: Date) =>
      messageBuilder({ ...props, publishedAt: _publishedAt }),
    build(): Message {
      return Message.fromData({
        id: props.id,
        text: props.text,
        author: props.author,
        publishedAt: props.publishedAt
      });
    }
  };
};
