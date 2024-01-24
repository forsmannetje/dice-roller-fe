import type { Explode, Keep, Target } from '@/model/RollConfig'
import { Option } from '@/model/helper/Option'
import { parse as _parse, type OngoingParsing } from './ParseHelper'
import { KeepParser } from './KeepParser'

interface FlagParseResult extends OngoingParsing {
  flag: Explode | Keep | Target
}

export interface FlagsParseResult extends OngoingParsing {
  explode?: Explode
  keep?: Keep
  target?: Target
}

export class FlagParser {
  static parse(input: String): FlagsParseResult {
    let remainingInput = input.trim()
    let flagParseResult: Option<FlagParseResult>

    let keep
    let explode
    let target

    do {
      flagParseResult = this.parseFlag(remainingInput)
      if (flagParseResult.isDefined) {
        const flag = flagParseResult.get()

        remainingInput = flag.remainingInput.trim()
        if ('infinite' in flag.flag) explode = flag.flag
        else if ('target' in flag.flag) target = flag.flag
        else keep = flag.flag
      }
    } while (flagParseResult.isDefined)

    return {
      remainingInput,
      explode,
      keep,
      target
    }
  }

  private static parseFlag(input: string): Option<FlagParseResult> {
    const regex = /^(?<explode>(?:i|I)?(?:e|E)\d*)|(?<keep>(?:k|K)(?:l|L)?\d*)|(?<target>(t|T)\d+)/

    return _parse(input, regex, (match) => {
      const remainingInput = input.replace(regex, '').trim()

      const explodeOpt = Option.from(match.groups!.explode).flatMap((explodeInput) =>
        this.parseExplode(explodeInput)
      )
      const keepOpt = Option.from(match.groups!.keep).flatMap((keepInput) =>
        KeepParser.parse(keepInput)
      )
      const targetOpt = Option.from(match.groups!.target).flatMap((targetInput) =>
        this.parseTarget(targetInput)
      )

      const flagOpt = explodeOpt.orElse(() => keepOpt).orElse(() => targetOpt)
      return {
        remainingInput,
        flag: flagOpt.get()
      }
    })
  }

  private static parseExplode(input: string): Option<Explode> {
    const regex = /^(?<infinite>(?:i|I))?(?:e|E)(?<minimum>\d*)$/

    return _parse(input, regex, (match) => {
      const infinite = !!match.groups!.infinite
      const minimum = match.groups!.minimum ? +match.groups!.minimum : undefined

      return { infinite, minimum }
    })
  }

  private static parseTarget(input: string): Option<Target> {
    const regex = /^(t|T)(?<target>\d+)$/

    return _parse(input, regex, (match) => {
      const target = +match.groups!.target

      return { target }
    })
  }
}
