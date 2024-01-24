<script setup lang="ts">
import TheExplanation from '@/components/parse/TheExplanation.vue';
import TheInput from '@/components/parse/TheInput.vue';
import RollOutput from '@/components/roll-output/RollOutput.vue';
import type { RollConfig } from '@/model/RollConfig';
import type { RollResult } from '@/model/RollResult';
import { DiceRollerDIKey } from '@/services/Services';
import { computed, inject, ref, type Ref } from 'vue';

const diceRoller = inject(DiceRollerDIKey)

const config: Ref<RollConfig | null> = ref(null);
const output: Ref<RollResult | null> = ref(null);
const errors: Ref<Error[]> = ref([]);

const lift = computed(() => output.value !== null);

async function submit(text: string) {
    const result = await diceRoller!.evaluate(text)

    if (result.isRight) {
        output.value = result.right.result;
        config.value = result.right.config;

        errors.value = [];
    } else {
        output.value = null;
        config.value = null;

        errors.value = result.left;
    }
}

function clear() {
    output.value = null;
    config.value = null;
    errors.value = [];
}
</script>

<template>
    <div class="container text-center" :class="{ 'lift': lift }">
        <TheInput @submit="submit" @clear="clear" />
        <Transition>
            <RollOutput v-if="!!output && !!config" :roll-result="output" :roll-config="config"/>
        </Transition>
        <div class="row" v-if="errors.length > 0">
            <ul class="list-unstyled">
                <li v-for="error in errors" :key="error.message">
                    <span class="text-danger">{{ error.message }}</span>
                </li>
            </ul>
        </div>
        <TheExplanation />
    </div>
</template>

<style scoped>
.container {
  margin-top: 15rem;
  transition: margin-top 0.5s ease-in-out;
}
.container.lift {
  margin-top: 5rem;
}
.row {
    margin-top: 1rem;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

</style>
