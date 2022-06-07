<template>
  <div id="topleft" class="band lb">
    <br />
    You have gone {{ formatDistance(player?.distance ?? 0) }}<br /><br />
    <span
      :style="{
        color: Decimal.eq(player?.velocity ?? 0, basics.data.maxVelocity)
          ? '#F77'
          : 'white',
      }"
      >[+{{ formatDistance(player?.velocity ?? 0) }}/s]</span
    ><br />
    [+{{ formatDistance(basics.data.accel) }}/s<sup>2</sup>] <br /><br />
    <NewsTicker />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDistance } from "@/util/format";
import player from "@/main";
import basics from "./basics";
import NewsTicker from "@/flourish/newsticker/newsticker.vue";
import Decimal from "break_eternity.js";

export default defineComponent({
  name: "Basics",
  components: {
    NewsTicker,
  },
  setup() {
    return {
      formatDistance,
      player,
      basics,
      Decimal,
    };
  },
});
</script>

<style>
#topleft {
  position: absolute;
  width: 80vw;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
