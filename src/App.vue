<template>
  <div
    class="wholePage"
    :style="{
      backgroundColor: player.timeReversal.active
        ? 'hsl(300, 10%, 10%)'
        : 'rgb(28, 28, 28)',
    }"
  >
    <div class="left">
      <div class="scrollable">
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
          <Stats v-if="player.tab === 'Stats'" />
          <Achs v-if="player.tab === 'Achievements'" />
          <Rockets v-if="player.tab === 'Rockets'" />
          <Auto v-if="player.tab === 'Automation'" />
          <TimeReversal v-if="player.tab === 'Time Reversal'" />
        </div>
      </div>
    </div>
    <div class="right">
      <Tabs />
    </div>
  </div>
</template>

<script setup lang="ts">
import { load, player } from "./main";
import Tabs from "./flourish/tabs/tabs.vue";
import Options from "./flourish/options/options.vue";
import Stats from "./flourish/other/stats.vue";
import Achs from "./features/achs/achs.vue";
import Basics from "./features/basics/basics.vue";
import Rockets from "./features/rockets/rockets.vue";
import Auto from "./features/auto/auto.vue";
import TimeReversal from "./features/timeReversal/timeReversal.vue";

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
  line-height: 1em;
}

.scrollable {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
  min-height: 150px;
  max-height: 100vh;
}

.wholePage {
  width: 100%;
  height: 100%;
  display: flex;
}

.left {
  flex: 4;
  min-height: 100vh;
  height: 100vh;
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
