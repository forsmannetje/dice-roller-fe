import { None, Some, type Option } from '@/model/helper/Option'

export interface OngoingParsing {
    remainingInput: string
  }

export function parse<T>(
  input: string,
  regex: RegExp,
  handle: (match: RegExpMatchArray) => T
): Option<T> {
  const match = input.match(regex)

  if (match) {
    return new Some(handle(match))
  }

  return None.only
}
