import type { DieConfig, RollConfig } from "./RollConfig";
import type { Either } from "./helper/Either";

export type DiceRollerResult = Either<DiceRollFailure, DiceRollSuccess>
export type DiceRollFailure = Error[]
export type DieRollResult = Roll[]
export type Roll = number

export interface DiceRollSuccess {
  input: string
  config: RollConfig
  result: RollResult
}

export interface RollResult {
    kept: IterationResult[];
    dropped?: IterationResult[];
}

export interface IterationResult {
    total: number;
    targetMet: boolean;

    rolls: DieResult[];
}

export interface DieResult {
    config: DieConfig;
    kept: DieRollResult[];
    dropped?: DieRollResult[];
}
