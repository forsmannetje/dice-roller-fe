import type { RollConfig } from '@/model/RollConfig'
import { Left, type Either, Right } from '@/model/helper/Either'

export const MAX_DICE = 30
export class RollConfigValidator {
  validate(config: RollConfig): Either<Error[], RollConfig> {
    const errors: Error[] = []
    if (config.iterations < 1) {
      errors.push(new Error('Need to define at least one iteration of rolls'))
    }

    if (config.pattern.dice.length === 0) {
      errors.push(new Error('Need at least a single roll'))
    }

    const diceCount = config.pattern.dice.reduce((acc, cur) => (acc = cur.amount), 0)
    const totalDice = diceCount * config.iterations
    if (totalDice > MAX_DICE) {
      errors.push(
        new Error(
          `You can only roll a combined 30 dice in roll. You are trying to roll ${diceCount} dice, ${config.iterations} times. So ${totalDice} in total`
        )
      )
    }

    if (errors.length > 0) return new Left(errors)
    else return new Right(config)
  }
}
