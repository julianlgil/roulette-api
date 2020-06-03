import {numberNullable} from "../utils/Types";

export interface IBetRequest {
    userId: string,
    rouletteId: string,
    number: numberNullable,
    color: string,
    amount: number
}
