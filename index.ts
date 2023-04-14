#!/usr/bin/env node
import { Command } from "commander";
import {
  PostMessageCommand,
  PostMessageCommandUseCase
} from "./src/application/use_case/post_message.usecase";
import { InMemoryMessageRepository } from "./src/infra/message.in_memory";

class DateProvider implements DateProvider {
  getNow(): Date {
    return new Date();
  }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new DateProvider();

const postMessageCommandUseCase = new PostMessageCommandUseCase(
  messageRepository,
  dateProvider
);

const program = new Command();

program
  .version("1.0.0")
  .description("CLI for the project")
  .addCommand(
    new Command("post")
      .argument("<user>", "the current user")
      .argument("<message>", "the message to post")
      .action((user, message) => {
        const postMessageCommand: PostMessageCommand = {
          id: "messageId",
          author: user,
          text: message
        };

        try {
          postMessageCommandUseCase.handle(postMessageCommand);
          console.table([messageRepository.messages]);
        } catch (e) {
          console.error(e.message);
        }
      })
  );

async function main() {
  await program.parseAsync();
}

main();
