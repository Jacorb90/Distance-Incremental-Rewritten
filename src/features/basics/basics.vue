<template>
  <div class="band lb">
    <br />
    <div v-if="Decimal.neq(timeReversal.data.timeSpeed.value, 1)">
      <div id="timeSpeedDiv">
        <br />Time Speed:
        {{ format(timeReversal.data.timeSpeed.value) }}&times;<br /><br />
      </div>
      <br />
    </div>
    You have gone {{ formatDistance(player.distance) }}<br /><br />
    <span
      :style="{
        color: Decimal.eq(player.velocity, basics.data.maxVelocity.value)
          ? '#F77'
          : 'white',
      }"
      >[+{{ formatDistance(player.velocity) }}/s] [Max:
      {{ formatDistance(basics.data.maxVelocity.value) }}/s]</span
    >
    <br />
    [+{{ formatDistance(basics.data.accel.value) }}/s<sup>2</sup>] <br /><br />
    <div class="flexRow">
      <button
        id="rank"
        class="btn"
        :class="{
          locked: Decimal.lt(player.distance, basics.data.rankReq.value),
        }"
        @click="basics.actions.rankUp()"
      >
        <b>Rank {{ formatWhole(player.rank) }}</b
        ><br /><br />
        Reset your journey, but
        {{
          RANK_DESCS[Decimal.add(player.rank, 1).toNumber()]?.value ??
          "rank up."
        }}
        <br />
        <b>Req: {{ formatDistance(basics.data.rankReq.value) }}</b>
      </button>

      <button
        id="tier"
        class="btn"
        :class="{ locked: Decimal.lt(player.rank, basics.data.tierReq.value) }"
        @click="basics.actions.tierUp()"
      >
        <b>Tier {{ formatWhole(player.tier) }}</b
        ><br /><br />
        Reset your ranks, but
        {{
          TIER_DESCS[Decimal.add(player.tier, 1).toNumber()]?.value ??
          "tier up."
        }}
        <br />
        <b>Req: Rank {{ formatWhole(basics.data.tierReq.value) }}</b>
      </button>
    </div>
    <br />
    {{ getUnlockDesc() }}<br /><br />
    <NewsTicker />

    <div id="versionDisplay">
      {{ getVersionDisplay(player.version) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, formatDistance, formatWhole } from "@/util/format";
import { player } from "@/main";
import { basics, RANK_DESCS, TIER_DESCS } from "./basics";
import NewsTicker from "@/flourish/newsticker/newsticker.vue";
import Decimal from "break_eternity.js";
import { getVersionDisplay } from "@/util/saveload";
import { getUnlockDesc } from "@/util/feature";
import { timeReversal } from "../timeReversal/timeReversal";
</script>

<style scoped>
#versionDisplay {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 20%);
  border: 2px solid grey;
  padding: 6px;
  font-weight: bold;
  font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
}

#rank {
  background-color: hsl(190, 20%, 25%);
  border: hsl(190, 20%, 15%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 200px;
  min-height: 120px;
  margin-bottom: 3px;
}

#rank:hover {
  background-color: hsl(190, 20%, 40%);
}

#tier {
  background-color: hsl(65, 20%, 25%);
  border: hsl(65, 20%, 15%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 200px;
  min-height: 120px;
  margin-bottom: 3px;
}

#tier:hover {
  background-color: hsl(65, 20%, 40%);
}

#timeSpeedDiv {
  width: 15em;
  background-color: hsl(300, 10%, 10%);
  border: 1px solid hsl(330, 40%, 50%);
  color: hsl(330, 40%, 50%);
  font-weight: bold;
}
</style>
