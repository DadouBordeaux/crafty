import { DateProvider } from "../domain/date_provider";


export class StubDateProvider implements DateProvider {
  now: Date;

  getNow(): Date {
    return this.now;
  }
}
