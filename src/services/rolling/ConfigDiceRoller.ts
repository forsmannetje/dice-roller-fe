import type {
  DieConfig,
  PatternConfig,
  Explode,
  Keep,
  RollConfig,
  Target
} from '@/model/RollConfig'
import { DieRoller } from './DieRoller'
import type { DieResult, IterationResult, RollResult } from '@/model/RollResult'
import type { Die } from '@/model/Die'

export const MAX_EXPLODES = 30

export class ConfigDiceRoller {
  constructor(private readonly core: DieRoller) {}

  evaluate(config: RollConfig): RollResult {
    const sortValue = (value: IterationResult) => value.total
    const results = Array(config.iterations)
      .fill(0)
      .map(() => this.evaluateIteration(config.pattern, config.explode, config.target))

    const keptResult = this.keep(results, sortValue, config.keep)
    return {
      kept: keptResult.kept,
      dropped: keptResult.dropped
    }
  }

  private evaluateIteration(rolls: PatternConfig, explode?: Explode, target?: Target): IterationResult {
    const rollResults = rolls.dice.map((dice) => this.evaluateDiceRoll(dice, explode))
    const total =
      rollResults
        .flatMap((result) => result.kept)
        .flatMap((result) => result)
        .reduce((acc, cur) => acc + cur, 0) + rolls.modifier

    return {
      total: total,
      targetMet: !target || total >= target.target,
      rolls: rollResults
    }
  }

  private evaluateDiceRoll(roll: DieConfig, explode?: Explode): DieResult {
    const sortValue = (value: number[]) => value.reduce((acc, cur) => acc + cur, 0)
    const results = Array(roll.amount)
      .fill(0)
      .map(() => this.evaluateRoll(roll.die, explode))

    const keptResult = this.keep(results, sortValue, roll.keep)
    return {
      config: roll,
      kept: keptResult.kept,
      dropped: keptResult.dropped
    }
  }

  private evaluateRoll(die: Die, explode?: Explode): number[] {
    const explodeOn = (explode && explode.minimum) || die.faces
    const explodeTimes = explode && explode.infinite ? MAX_EXPLODES : 1
    const results: number[] = []

    let roll: number
    let doExplode = !!explode
    let exploded = 0

    do {
      roll = this.core.rollDice(die)
      results.push(roll)

      doExplode = doExplode && roll >= explodeOn && exploded < explodeTimes
      exploded++
    } while (doExplode)

    return results
  }

  private keep<T>(results: T[], sortValue: (result: T) => number, keep?: Keep): KeptResults<T> {
    if (keep && results.length > keep.amount) {
      const sorted = [...results].sort((left, right) => {
        const leftValue = sortValue(left)
        const rightValue = sortValue(right)

        if (keep.highest) return rightValue - leftValue
        else return leftValue - rightValue
      })

      return {
        kept: sorted.slice(0, keep.amount),
        dropped: sorted.slice(keep.amount)
      }
    }

    return { kept: results }
  }
}

interface KeptResults<T> {
  kept: T[]
  dropped?: T[]
}
