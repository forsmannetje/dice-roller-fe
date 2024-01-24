<script setup lang="ts">
import { ref, type Ref } from 'vue';

const emits = defineEmits(['submit', 'clear']);
const input = ref('');
const inputRef: Ref<HTMLInputElement | null> = ref(null);

function submit() {
    emits('submit', input.value);
}

function clear() {
    input.value = '';
    inputRef.value!.focus();
    emits('clear');
}
</script>

<template>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <form @submit.prevent="" @keyup.enter="submit()">
                <div class="input-group">
                    <input ref="inputRef" v-model="input" class="form-control" placeholder="Example: 3 d4 - 2d6kl1 + 5 ie5 kl2 t3" />
                    <button type="button" class="btn btn-light" @click="clear()" v-if="!!input">
                        <strong class="text-danger">&cross;</strong>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
