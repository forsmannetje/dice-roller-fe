import type { DieConfig } from '@/model/RollConfig'
import { None, Some, type Option } from '@/model/helper/Option'

export function normalizeDice(dice: DieConfig[]): DieConfig[] {
  return [...dice]
    .sort((left, right) => left.die.faces - right.die.faces || left.amount - right.amount)
    .reduce((prev, cur) => reduceDice(prev, cur), [] as DieConfig[])
}

function reduceDice(currentResult: DieConfig[], nextValue: DieConfig): DieConfig[] {
  if (currentResult.length === 0) return [nextValue]
  else {
    const [previousValue] = currentResult.slice(-1)
    return combineDice(previousValue, nextValue)
      .map((value) => [...currentResult.slice(0, -1), value])
      .orElseGet(() => [...currentResult, nextValue])
  }
}

function combineDice(left: DieConfig, right: DieConfig): Option<DieConfig> {
  if (left.die.faces === right.die.faces && !left.keep && !right.keep) {
    return new Some({
      die: left.die,
      amount: left.amount + right.amount
    })
  }

  return None.only
}
