<script setup lang="ts">
import type { RollConfig } from '@/model/RollConfig';
import type { IterationResult } from '@/model/RollResult';
import { flipSign } from '@/services/util/FlipSign';
import { computed } from 'vue';
import DieOutput from './DieOutput.vue';

interface Props {
    result: IterationResult,
    dropped?: boolean,
    config: RollConfig
}

const props = withDefaults(defineProps<Props>(), {
    dropped: false
})
const modifierOutput = computed(() => {
    const modifier = props.config.pattern.modifier

    if (modifier > 0) return `+ ${modifier}`
    else if (modifier < 0) return `- ${flipSign(modifier)}`
    else return ''
})
</script>

<template>
    <tr class="font-monospace" :class="{ dropped: dropped }">
        <td class="total">
            <strong>{{ result.total }}</strong>
        </td>
        <td class="target" v-if="!!config.target">
            <strong class="text-secondary" v-if="dropped">&ndash;</strong>
            <strong class="text-success" v-else-if="result.targetMet">&check;</strong>
            <strong class="text-danger" v-else>&cross;</strong>
        </td>
        <td class="equals">&#61;</td>
        <td class="rolls">
            <span v-for="(rolls, i) in result.rolls" :key="i">
                <span v-if="i !== 0">, </span>
                <DieOutput :display-roll-config="result.rolls.length > 1" :result="rolls" />
            </span>
            <span v-if="!!modifierOutput">&nbsp;{{ modifierOutput }}</span>
        </td>
    </tr>
</template>

<style scoped>
tr.dropped td {
    color: rgb(53, 53, 53);
}
tr.dropped td.target {
    filter: brightness(30%);
}

td.total,
td.target,
td.equals {
    width: 1%;
    white-space: nowrap;
}

td {
    text-align: left;
}

td.total {
    text-align: right;
}
</style>@/model/RollConfig