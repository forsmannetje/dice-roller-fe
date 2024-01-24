import { type Keep } from '@/model/RollConfig'
import { type Option } from '@/model/helper/Option'
import { parse as _parse } from './ParseHelper'

export class KeepParser {
  static parse(input: string): Option<Keep> {
    const regex = /^((?:k|K)(?<sign>(?:l|L))?(?<amount>\d*))$/

    return _parse(input, regex, (match) => {
      const amount = +(match.groups!.amount || 1)
      const highest = !match.groups!.sign

      return { amount, highest }
    })
  }
}
