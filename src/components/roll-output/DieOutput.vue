<script setup lang="ts">
import type { DieResult, DieRollResult } from '@/model/RollResult';
import { RollStringBuilder } from '@/services/parsing/RollStringBuiler';
import { computed } from 'vue';

interface Props {
    displayRollConfig: boolean,
    result: DieResult
}

const props = defineProps<Props>()
const rollConfigOutput = computed(() => {
    return RollStringBuilder.diceRollToString(props.result.config, false)
})
const keptResults = computed(() => {
    return props.result.kept.map(mapRolls)
})
const droppedResults = computed(() => {
    return props.result.dropped && props.result.dropped.map(mapRolls)
})

function mapRolls(rolls: DieRollResult): string {
    if (rolls.length === 1) return `${rolls[0]}`
    else if (props.result.config.amount === 1) return `${rolls.join(', ')}`
    else return `[ ${rolls.join(', ')} ]`
}
</script>

<template>
    <span class="font-monospace">
        <span class="text-primary" v-if="displayRollConfig">{{ rollConfigOutput }}:&nbsp;</span>
        <span>[&nbsp;</span>
        <span v-for="(result, index) in keptResults" :key="index">
            <span v-if="index !== 0">, </span>{{ result }}
        </span>
        <template v-if="!!droppedResults">
            <span v-for="(result, index) in droppedResults" :key="index">    
                <span class="dropped">, {{ result }}</span>
            </span>
        </template>
        <span>&nbsp;]</span>
    </span>
</template>

<style scoped>
.dropped {
    color: rgb(53, 53, 53);
}
</style>