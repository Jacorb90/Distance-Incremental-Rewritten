<template>
  <q-tooltip
    anchor="top middle"
    self="bottom middle"
    class="shadow-4"
    style="font-size: 0.8em"
    transition-show="scale"
    transition-hide="scale"
    v-model="shown"
  >
    <slot></slot>
  </q-tooltip>
</template>

<script setup lang="ts">
import { ref } from "vue";

const shown = ref(false);
</script>
