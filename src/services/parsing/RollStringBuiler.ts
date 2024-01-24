import type { DieConfig, Explode, Keep, RollConfig, Target } from '@/model/RollConfig'
import { flipSign } from '../util/FlipSign'

export class RollStringBuilder {
  static toString(configuration: RollConfig): string {
    let result = ''

    if (configuration.iterations > 1) {
      result += `${configuration.iterations} `
    }

    let addSign = false
    for (const roll of configuration.pattern.dice) {
      result += `${this.diceRollToString(roll, addSign)} `
      addSign = true
    }

    if (configuration.pattern.modifier < 0) result += `- ${configuration.pattern.modifier * -1} `
    else if (configuration.pattern.modifier > 0) result += `+ ${configuration.pattern.modifier} `

    if (configuration.explode) result += `${this.explodeToString(configuration.explode)} `
    if (configuration.keep) result += `${this.keepToString(configuration.keep)} `
    if (configuration.target) result += `${this.targetToString(configuration.target)} `

    return result.trim()
  }

  static diceRollToString(roll: DieConfig, addSign: boolean): string {
    let result = ''
    if (!addSign && roll.amount < 0) result += '-'
    if (addSign) result += roll.amount < 0 ? '- ' : '+ '
    if (roll.amount > 1) result += flipSign(roll.amount, roll.amount < 0)

    result += `d${roll.die.faces}`

    if (roll.keep) result += this.keepToString(roll.keep)

    return result
  }

  private static keepToString(keep: Keep): string {
    let result = 'k'
    if (!keep.highest) result += 'l'
    if (keep.amount > 1) result += keep.amount

    return result
  }

  private static explodeToString(explode: Explode): string {
    let result = ''
    if (explode.infinite) result += 'i'
    result += 'e'
    if (explode.minimum) result += explode.minimum

    return result
  }

  private static targetToString(target: Target): string {
    return `t${target.target}`
  }
}
