<template>
  <br /><br /><br />
  <button
    class="btn tr"
    :class="{ unTR: player.timeReversal.active }"
    @click="player.timeReversal.active = !player.timeReversal.active"
  >
    {{ player.timeReversal.active ? "Normalize Time" : "Reverse Time" }}
    <Tooltip
      >Lose {{ formatWhole(50) }}% of Distance every second, but gain Time Cubes
      based on lost resources as a result.</Tooltip
    ></button
  ><br /><br />
  {{ formatWhole(Decimal.floor(player.timeReversal.cubes)) }} Time Cubes (+{{
    format(timeReversal.data.timeCubeGain.value)
  }}/s)<br /><br /><br />
  <div class="row justify-center q-gutter-xs">
    <button
      v-for="id in Object.keys(TR_UPGRADE_COSTS).map(Number)"
      :key="id"
      style="height: 12em"
      @click="timeReversal.actions.buyUpg(id)"
      class="btn"
      :class="{
        bought: player.timeReversal.upgrades.includes(id),
        tr:
          !player.timeReversal.upgrades.includes(id) &&
          Decimal.gte(player.timeReversal.cubes, TR_UPGRADE_COSTS[id]),
        locked:
          !player.timeReversal.upgrades.includes(id) &&
          Decimal.lt(player.timeReversal.cubes, TR_UPGRADE_COSTS[id]),
      }"
    >
      {{ timeReversal.data[id].value.description }}<br />
      <span v-if="timeReversal.data[id].value.effect !== undefined"
        >Currently:
        <span v-if="timeReversal.data[id].value.effectDesc !== undefined">{{
          timeReversal.data[id].value.effectDesc?.(
            timeReversal.data[id].value.effect ?? 1
          )
        }}</span
        ><span v-else
          >{{ format(timeReversal.data[id].value.effect ?? 1) }}x</span
        ><br
      /></span>
      <span v-if="!player.timeReversal.upgrades.includes(id)"
        >Cost: {{ formatWhole(TR_UPGRADE_COSTS[id]) }} Time Cubes</span
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { player } from "@/main";
import { format, formatWhole } from "@/util/format";
import Decimal from "break_eternity.js";
import { timeReversal, TR_UPGRADE_COSTS } from "./timeReversal";
import Tooltip from "@/components/Tooltip.vue";
</script>

<style scoped>
.btn.unTR {
  background-color: hsl(340, 51%, 20%);
  border-color: hsl(340, 50%, 40%);
}

.btn.unTR:hover {
  background-color: hsl(340, 50%, 35%);
  border-color: hsl(340, 50%, 60%);
}
</style>
