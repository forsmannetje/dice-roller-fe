<script setup lang="ts">
import { ref } from 'vue';

const showExplanation = ref(false);

function toggleExplanation() {
    showExplanation.value = !showExplanation.value;
}
</script>

<template>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <button type="button" class="btn btn-info" v-if="showExplanation" @click="toggleExplanation">Hide
                explanation</button>
            <button type="button" class="btn btn-info" v-else @click="toggleExplanation">Show explanation</button>
        </div>
    </div>
    <Transition>
        <div class="row text-start font-monospace scroll-container" v-if="showExplanation">
            <div class="col-md-6 offset-md-3">
                <p>Example:
                    <span class="text-primary">3</span> <span class="text-success">d4 - 2d6kl1 + 5</span> <span
                        class="text-info">ie5 kl2 t3</span>
                </p>
                <h4 class="text-primary">Iterations</h4>
                <p>
                    <span class="text-primary">3</span> is the amount of iterations.
                    The roll pattern will be evaluated once for every iteration.
                    The results are stored per iteration and not added.
                </p>
                <h4 class="text-success">Roll pattern</h4>
                <p>
                    <span class="text-success">d4 - 2d6kl1 + 5</span> is the roll pattern.
                    It can consist of any number of dice rolls (up to 30 in total with iterations) and modifiers.
                    <br />
                    <br />The pattern for a single dice roll is <span class="text-warning">(x)dy(klz)</span>
                    <br /><span class="text-warning">x</span> is an optional amount of dice. Default is 1.
                    <br /><span class="text-warning">d</span> to denote a die being rolled. It is case insensitive.
                    <br /><span class="text-warning">y</span> the amount of faces for the die. Supported values are 4, 6, 8,
                    10, 12, 20 and 100.
                    <br /><span class="text-warning">klz</span> triggers keeping. See the keep flag below for an explanation
                    of the syntax.
                </p>
                <h4 class="text-info">Flags</h4>
                <p>
                    <span class="text-info">ie5 kl2 t3</span> are flags respectively for explosion, keeping and targets. See
                    below.
                </p>
                <h5 class="text-info-emphasis">Explosion</h5>
                <p>
                    Exploding rolls a die again if the previous roll was high enough and add to the total.
                    By default a die will be rolled again once at most.
                    <br />
                    <br />The pattern for exploding is <span class="text-warning">(i)e(x)</span>
                    <br /><span class="text-warning">i</span> to switch to infinite explosion. Dice will be rolled again up
                    to 20 times.
                    <br /><span class="text-warning">e</span> to indicate the die should explode.
                    <br /><span class="text-warning">x</span> the minimum result on a roll to explode. Defaults to the
                    maximum number on a die.
                </p>
                <h5 class="text-info-emphasis">Keep</h5>
                <p>
                    Keep will drop results. By default lower results are dropped first.
                    A keep pattern can be attached to a die roll. Keeping on a die roll will evaluate keep before results
                    are tallied.
                    Keeping as a global flag will drop iteration results.
                    <br />
                    <br />The pattern for keeping is <span class="text-warning">k(l)(x)</span>
                    <br /><span class="text-warning">k</span> to indicate results should be kept. Case insensitive.
                    <br /><span class="text-warning">l</span> to indicate higher results should be dropped first.
                    <br /><span class="text-warning">x</span> the maximum amount of results to keep. Defaults to 1.
                </p>
                <h5 class="text-info-emphasis">Target</h5>
                <p>
                    Target will match the total of an iteration against a provided value.
                    The total of the iteration needs to equal or exceed the target to be met.
                    <br />
                    <br />The pattern for targets is <span class="text-warning">tx</span>
                    <br /><span class="text-warning">t</span> to indicate a target should be checked.
                    <br /><span class="text-warning">x</span> the total to meet.
                </p>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.row {
    margin-top: 1rem;
}

.scroll-container {
    overflow: scroll;
    height: 400px;
}

.v-enter-active,
.v-leave-active {
    transition: height 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    height: 0;
}
</style>