import { RollConfigValidator } from './configuration/ValidateConfiguration'
import { RollConfigParser } from './parsing/RollParser'
import { DieRoller } from './rolling/DieRoller'
import { LocalDiceRoller } from './rolling/LocalDiceRoller'
import { ConfigDiceRoller } from './rolling/ConfigDiceRoller'
import type { InjectionKey } from 'vue'
import type { DiceRoller } from './rolling/DiceRoller'

export const DiceRollerDIKey = Symbol() as InjectionKey<DiceRoller>;
export const diceRoller = new LocalDiceRoller(
    new RollConfigParser(),
    new RollConfigValidator(), 
    new ConfigDiceRoller(new DieRoller())
)
