import {DateProvider} from "./post_message.usecase";


export class StubDateProvider implements DateProvider {
    now: Date;

    getNow(): Date {
        return this.now;
    }
}
