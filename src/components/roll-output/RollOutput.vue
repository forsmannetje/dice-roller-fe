<script setup lang="ts">
import type { RollConfig } from '@/model/RollConfig';
import type { RollResult } from '@/model/RollResult';
import { RollStringBuilder } from '@/services/parsing/RollStringBuiler';
import { computed } from 'vue';
import IterationOutput from './IterationOutput.vue';

interface Props {
    rollResult: RollResult,
    rollConfig: RollConfig
}

const props = defineProps<Props>()
const normalizedInput = computed(() => RollStringBuilder.toString(props.rollConfig))
</script>

<template>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <h3 class="font-monospace text-success">Results for: <strong>{{ normalizedInput }}</strong></h3>
            <table class="table table-borderless">
                <tbody>
                    <IterationOutput 
                        v-for="(result, i) in rollResult.kept" 
                        :key="i" 
                        :result="result"
                        :config="rollConfig" />
                    <template v-if="!!rollResult.dropped">
                        <IterationOutput 
                            v-for="(result, i) in rollResult.dropped" 
                            :key="i" 
                            :result="result" 
                            :dropped="true"
                            :config="rollConfig" />
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>
