import { HeaderDays } from "./models/header-days";

export class ChangeDateArg {

  constructor(public type: string, public operation: string, public roomtype: number, public days: HeaderDays) { }

}
