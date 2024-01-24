import { RollConfig } from '@/model/RollConfig'
import { DiceParser } from './DiceParser'
import { IterationParser } from './IterationParser'
import { FlagParser } from './FlagParser'

/**
 * Examples
 *
 * Simplest
 * /roll d6                         // Roll a d6
 *
 * Combined dice
 * /roll 2d6                        // Roll 2 d6 and add them
 * /roll 2d6+5                      // Roll 2 d6, add them and add 5
 * /roll 2d6+3d8+2                  // Roll 2 d6, 3 d8, add all of it together with 2
 * /roll 2d6 + 3d8 + 2              // Same as above, allow for spaces
 *
 * Combined dice keep
 * /roll 2d20k                      // Roll 2 d20, keep highest
 * /roll 2d20kl                     // Roll 2 d20, keep lowest
 * /roll 8d20k4                     // Roll 8 d20, keep highest 4
 * /roll 4d20kl2                    // Roll 4 d20, keep lowest 2
 *
 * Sequences
 * /roll 2 d6                       // Roll 2 d6 and keep results separate
 * /roll 2 d6 + 3d10 + 3            // Roll a d6, 3 d10 add all together with 3, roll that sequence twice and keep keep separate results
 *
 * Targets
 * /roll 5d6 t20                    // Roll 5 d6, add together and check if the result is >= 20
 * /roll 5 d6 t4                    // Roll 5 d6, keep separate and check for each if the result is >= 4
 *
 * Targets with keep (D&D advantage / disadvantage against AC for instance)
 * /roll 2d20k+11 t22               // Roll 2 d20 keep highest, add 11 and check if the result is >= 22
 *
 * Explosion
 * Only allow explosion on single dice in sequences
 * /roll 2d6 e5 === 2 d6 e5         // roll a d6 and explode on 5 or higher, roll that sequence twice and keep separate results
 * /roll 2d6 ie === 2 d6 ie         // roll a d6 and explode on 6, keep exploding 6's, roll that sequence twice and keep separate results
 *
 * Explosion with targets
 * /roll 5d6 ie t11 === 5 d6 ie t11 // roll d6, keep exploding on 6's, and check if the result is >= 11 per exploded roll, 5 times
 *
 * Sequences with keep
 * /roll 2 3d12+5 k                 // roll 3 d12, add them with 5, roll the sequence twice and keep the highest
 * /roll 2 3d12+5 kl                // roll 3 d12, add them with 5, roll the sequence twice and keep the lowest
 * /roll 3 3d12+5 k2                // roll 3 d12, add them with 5, roll the sequence thrice and keep the highest 2
 * /roll 3 3d12+5 kl2               // roll 3 d12, add them with 5, roll the sequence thrice and keep the lowest 2
 *
 * Sequence combination
 * /roll 5 d6 k3 ie t10             // roll a d6, infinitely exploding 6's, 5 times, keep highest three results, check if result is >= 10
 *
 * Errors
 * /roll 2 3d6 ie                   // ie is only allowed with sequences without combined rolls
 * /roll 2d10k ie                   // keep on combined dice is incompatible with ie
 */
export class RollConfigParser {
  parse(input: string): RollConfig {
    let unProcessedInput = input.trim()

    const iterationsParseResult = IterationParser.parse(unProcessedInput)

    unProcessedInput = iterationsParseResult.remainingInput

    const diceParseResult = DiceParser.parse(unProcessedInput)

    unProcessedInput = diceParseResult.remainingInput

    const flagParseResult = FlagParser.parse(unProcessedInput)

    return new RollConfig(
      iterationsParseResult.iterations,
      diceParseResult.rolls,
      flagParseResult.keep,
      flagParseResult.explode,
      flagParseResult.target
    )
  }
}
