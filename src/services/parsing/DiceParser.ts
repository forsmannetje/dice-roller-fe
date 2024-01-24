import { fromFaces } from '@/model/Die'
import type { DieConfig, PatternConfig } from '@/model/RollConfig'
import type { Either } from '@/model/helper/Either'
import { Option } from '@/model/helper/Option'
import { KeepParser } from './KeepParser'
import { parse as _parse, type OngoingParsing } from './ParseHelper'
import { flipSign } from '../util/FlipSign'

export interface DiceParseResult extends OngoingParsing {
  rolls: PatternConfig
}

export interface DieModParseResult extends OngoingParsing {
  dieOrMod: Either<DieConfig, number>
}

export interface SignParseResult extends OngoingParsing {
  sign: string
}

export class DiceParser {
  static parse(input: string): DiceParseResult {
    let rolls: PatternConfig = {
      dice: [],
      modifier: 0
    }

    let keepGoing = true
    let remainingInput = input.trim()
    let nextSign = '+'
    do {
      const dieOrModOpt = this.parseDieOrMod(remainingInput, nextSign === '-')

      keepGoing = dieOrModOpt.isDefined
      if (dieOrModOpt.isDefined) {
        const dieOrMod = dieOrModOpt.get()
        rolls = this.combineResults(rolls, dieOrMod.dieOrMod)

        remainingInput = dieOrMod.remainingInput

        const signOpt = this.parseSign(remainingInput)

        keepGoing = signOpt.isDefined
        if (signOpt.isDefined) {
          const sign = signOpt.get()
          nextSign = sign.sign
          remainingInput = sign.remainingInput
        }
      }
    } while (keepGoing)

    return { rolls, remainingInput }
  }

  private static parseDieOrMod(input: string, subtract: boolean): Option<DieModParseResult> {
    // Capture group die:
    // - Optional negative sign and whitespace
    // - Optional amount of dice followed by 'd' or 'D' followed by one of allowed dice faces
    // Or
    // Capture group mod:
    // - Optional negative sign and whitespace
    // - amount
    const regex =
      /^(?<die>(?:-\s*)?\d*(?:d|D)(?:4|6|8|10|12|20|100)(?:kl?\d*)?)|(?<mod>(?:-\s*)?\d+)/

    return _parse(input, regex, (match) => {
      const remainingInput = input.replace(regex, '').trim()
      const dieOpt: Option<DieConfig> = Option.from(match.groups!.die)
        .flatMap((input) => this.parseDie(input, subtract))
      const modOpt: Option<number> = Option.from(match.groups!.mod)
        .flatMap((input) => this.parseMod(input, subtract))

      return {
        remainingInput,
        dieOrMod: modOpt.toEither(() => dieOpt.get())
      }
    })
  }

  private static parseDie(input: string, subtract: boolean): Option<DieConfig> {
    const regex =
      /^(?<sign>-)?\s*(?<amount>\d*)(?:d|D)(?<faces>4|6|8|10|12|20|100)(?<keep>(?:k|K)(?:l|L)?\d*)?$/

    return _parse(input, regex, (match) => {
      const subtractAgain = !!match.groups!.sign
      const amount = +(match.groups!.amount || 1)
      const die = fromFaces(+match.groups!.faces)

      const keepOpt = Option.from(match.groups!.keep).flatMap((keepInput) =>
        KeepParser.parse(keepInput)
      )

      return {
        amount: flipSign(amount, subtract != subtractAgain),
        die,
        keep: keepOpt.isDefined ? keepOpt.get() : undefined
      }
    })
  }

  private static parseMod(input: string, subtract: boolean): Option<number> {
    const regex = /^(?<sign>-)?\s*(?<amount>\d+)$/

    return _parse(input, regex, (match) => {
      const subtractAgain = !!match.groups!.sign
      const amount = flipSign(+match.groups!.amount, subtract != subtractAgain)

      return amount
    })
  }

  private static parseSign(input: string): Option<SignParseResult> {
    const regex = /^(?<sign>\+|-)\s*/

    return _parse(input, regex, (match) => {
      const sign = match.groups!.sign
      const remainingInput = input.replace(regex, '').trim()

      return {
        remainingInput,
        sign
      }
    })
  }

  private static combineResults(current: PatternConfig, result: Either<DieConfig, number>): PatternConfig {
    return {
      dice: result.isRight ? current.dice : [...current.dice, result.left],
      modifier: result.isRight ? current.modifier + result.right : current.modifier
    }
  }
}
