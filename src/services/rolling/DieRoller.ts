import { Xorshift03 } from './random/Xorshift03';
import { type Die } from '@/model/Die';

export class DieRoller {
  private randomNumberGenerator: () => number = Xorshift03();

  rollDice(die: Die): number {
    return Math.floor(this.randomNumberGenerator() * die.faces) + 1;
  }
}