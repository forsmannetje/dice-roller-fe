import type { DiceRollerResult } from '@/model/RollResult'
import type { RollConfigValidator } from '../configuration/ValidateConfiguration'
import type { RollConfigParser } from '../parsing/RollParser'
import { RollStringBuilder } from '../parsing/RollStringBuiler'
import type { ConfigDiceRoller } from './ConfigDiceRoller'
import type { DiceRoller } from './DiceRoller'

export class LocalDiceRoller implements DiceRoller {
  constructor(
    private readonly parser: RollConfigParser,
    private readonly validator: RollConfigValidator,
    private readonly delegate: ConfigDiceRoller
  ) {}

  evaluate(input: string): Promise<DiceRollerResult> {
    return Promise.resolve(
      this.validator.validate(this.parser.parse(input)).map((config) => ({
        input: RollStringBuilder.toString(config),
        config,
        result: this.delegate.evaluate(config)
      }))
    )
  }
}
