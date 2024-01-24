import type { DiceRollerResult } from "@/model/RollResult";

export interface DiceRoller {
    evaluate(input: string): Promise<DiceRollerResult>
}
