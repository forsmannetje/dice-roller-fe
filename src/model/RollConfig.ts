import { normalizeDice } from '@/services/configuration/NormalizeDice'
import type { Die } from './Die'

export class RollConfig {
  readonly pattern: PatternConfig

  constructor(
    readonly iterations: number,
    pattern: PatternConfig,
    readonly keep?: Keep,
    readonly explode?: Explode,
    readonly target?: Target
  ) {
    this.pattern = {
      dice: normalizeDice(pattern.dice),
      modifier: pattern.modifier
    }
  }
}

export interface PatternConfig {
  dice: DieConfig[]
  modifier: number
}

export interface DieConfig {
  amount: number
  die: Die
  keep?: Keep
}

export interface Keep {
  amount: number
  highest: boolean
}

export interface Explode {
  infinite: boolean
  minimum?: number
}

export interface Target {
  target: number
}
