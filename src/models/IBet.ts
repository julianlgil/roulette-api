import {numberNullable} from "../utils/Types";

export interface IBet {
    number: numberNullable,
    color: string,
    amount: number,
    userId: string
}
