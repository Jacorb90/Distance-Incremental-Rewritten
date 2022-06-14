<template>
  <div class="left">
    <Basics />
    <div>
      <Options v-if="player.tab === 'Options'" />
      <Rockets v-if="player.tab === 'Rockets'" />
    </div>
  </div>
  <div class="right">
    <Tabs />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import player, { gameLoop, metaSave } from "./main";
import { loadSave, saveGame, startingSave, versionControl } from "./saveload";
import { signal } from "./util/feature";
import Tabs from "./flourish/tabs/tabs.vue";
import Options from "./flourish/options/options.vue";
import basicsVue from "./features/basics/basics.vue";
import rocketsVue from "./features/rockets/rockets.vue";

export default defineComponent({
  name: "App",
  components: {
    Basics: basicsVue,
    Rockets: rocketsVue,
    Tabs,
    Options,
  },
  setup() {
    return {
      player,
    };
  },
  mounted() {
    document.title = "Distance Incremental Rewritten";

    metaSave.value = loadSave();
    player.value =
      metaSave.value.saves[metaSave.value.currentSave] ??
      startingSave(metaSave.value.currentSave);
    versionControl(player.value);

    if (!player.value.opts.offlineTime)
      player.value.lastTime = new Date().getTime();

    signal("load", 0);

    gameLoop();

    setInterval(() => {
      if (player.value.opts.autoSave) saveGame(metaSave.value);
    }, 5000);
  },
});
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
</style>
