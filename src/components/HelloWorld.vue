<script setup lang="ts">
import { D10 } from '@/model/Die';
import { RollConfigValidator } from '@/services/configuration/ValidateConfiguration';
import { RollConfigParser } from '@/services/parsing/RollParser';
import { RollStringBuilder } from '@/services/parsing/RollStringBuiler';
import { DieRoller } from '@/services/rolling/DieRoller';

const parser = new RollConfigParser()
const validator = new RollConfigValidator()

interface Props {
  msg: string
}

defineProps<Props>();

const diceRoller = new DieRoller();
const results: number[] = []
for (let i = 0; i < 10; i++) {
  results.push(diceRoller.rollDice(D10))
}

const validatedConfig = validator.validate(parser.parse('2 d6 +3d6 +8 -5 t15 kl2 ie'));
const normalizedString = validatedConfig.map((config) => RollStringBuilder.toString(config))
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
    <ul>
      <li v-for="(result, index) in results" :key="index">{{ result }}</li>
    </ul>
    <p v-if="normalizedString.isRight">{{ normalizedString.right }}</p>
    <ul v-else>
      <li v-for="error in normalizedString.left" :key="error.message">{{ error.message }}</li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
@/model/Die@/services/rolling/DiceRollerCore