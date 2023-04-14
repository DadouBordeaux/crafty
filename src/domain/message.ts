export class MessageTooLongError extends Error {
}

export class EmptyMessageError extends Error {
}

export class Message {
  constructor(
    readonly id: string,
    readonly author: string,
    private _text: MessageText,
    readonly publishedAt: Date
  ) {
  }

  get text() {
    return this._text.value;
  }

  editText(text: string) {
    this._text = MessageText.of(text);
  }

  get data() {
    return {
      id: this.id,
      author: this.author,
      text: this._text.value,
      publishedAt: this.publishedAt
    };
  }

  static fromData(data: Message["data"]): Message {
    return new Message(
      data.id,
      data.author,
      MessageText.of(data.text),
      data.publishedAt
    );
  }
}

export class MessageText {
  private constructor(readonly value: string) {
  }

  static of(text: string): MessageText {
    if (text.length > 280) {
      throw new MessageTooLongError();
    }

    if (text.trim().length === 0) {
      throw new EmptyMessageError();
    }

    return new MessageText(text);
  }
}
