import { parse as _parse, type OngoingParsing } from './ParseHelper'

export interface IterationsParseResult extends OngoingParsing {
  iterations: number
}

export class IterationParser {
  static parse(input: string): IterationsParseResult {
    const regex = /^(?<iterations>\d+)\s+/
    const trimmedInput = input.trim()

    return _parse(trimmedInput, regex, (match) => {
      const iterations = +match.groups!.iterations

      return {
        iterations,
        remainingInput: trimmedInput.replace(regex, '').trim()
      }
    }).orElseGet(() => ({ iterations: 1, remainingInput: trimmedInput }))
  }
}
