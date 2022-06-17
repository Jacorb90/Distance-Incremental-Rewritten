<template>
  <div class="left">
    <Basics />
    <div>
      <button
        v-if="player.tab !== null"
        @click="player.tab = null"
        class="btn min"
      >
        Hide
      </button>
      <Options v-if="player.tab === 'Options'" />
      <Rockets v-if="player.tab === 'Rockets'" />
    </div>
  </div>
  <div class="right">
    <Tabs />
  </div>
</template>

<script setup lang="ts">
import { load, player } from "./main";
import Tabs from "./flourish/tabs/tabs.vue";
import Options from "./flourish/options/options.vue";
import Basics from "./features/basics/basics.vue";
import Rockets from "./features/rockets/rockets.vue";

load();
</script>

<style>
* {
  color: white;
  margin: 0 auto;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow: hidden;
  transition-duration: 0.2s;
  cursor: default;
  user-select: none;
}

body {
  background-color: rgb(28, 28, 28) !important;
}

#app {
  display: flex;
}

.left {
  flex: 4;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 100vh;
}

.right {
  flex: 1;
  z-index: 5;
  border-left: thick solid hsl(0, 0%, 30%);
  min-height: 100vh;
}

.band {
  width: 100%;
  min-height: 75px;
}

.lb {
  background-color: hsl(0, 0%, 20%);
}

.btn.min {
  float: left;
}
</style>
