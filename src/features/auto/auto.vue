<template>
  <br /><br /><br />
  <div class="flexRow">
    <div v-for="i in AUTO_COUNT" :key="i">
      <div v-if="auto.data[index(i)].visible.value" class="autoBox">
        <div v-if="player.auto[index(i)].unl">
          <h6>{{ auto.constants[index(i)].name }}</h6>
          <br />
          <button
            class="btn toggle"
            :class="{ neg: !player.auto[index(i)].active }"
            @click="auto.actions.toggle(index(i))"
          >
            <q-icon
              :name="player.auto[index(i)].active ? 'check' : 'close'"
            /></button
          ><br /><br />

          Efficiency:
          {{ format(auto.data[index(i)].power.value.times(100)) }}%<br /><br />

          <button
            class="btn"
            :class="{ locked: !auto.data[index(i)].canBuyUpg.value }"
            style="border-radius: 0px; border-left: 0px; border-right: 0px"
            @click="auto.actions.upgrade(index(i))"
          >
            Upgrade Efficiency Level [{{
              formatWhole(player.auto[index(i)].level)
            }}]<br /><br />
            Cost: {{ format(auto.data[index(i)].upgReq.value) }}
            {{ auto.constants[index(i)].upgResName }}</button
          ><br />
          <button
            class="btn"
            :class="{
              bought: player.auto[index(i)].mastered,
              locked:
                !player.auto[index(i)].mastered &&
                Decimal.lt(
                  player.distance,
                  auto.constants[index(i)].masteryReq
                ),
            }"
            style="border-radius: 0px; border-left: 0px; border-right: 0px"
            @click="auto.actions.master(index(i))"
          >
            {{ auto.data[index(i)].masteryDesc.value }} <br /><br />
            <span v-if="player.auto[index(i)].mastered">[BOUGHT]</span>
            <span v-else
              >Cost:
              {{ formatDistance(auto.constants[index(i)].masteryReq) }}</span
            >
          </button>
        </div>
        <div v-else>
          <h6>{{ Automated[i - 1] }}</h6>
          <br /><br />
          <b>REQUIRES: {{ auto.data[index(i)].desc.value }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Automated, AUTO_COUNT, auto } from "./auto";
import { player } from "@/main";
import { format, formatDistance, formatWhole } from "@/util/format";
import Decimal from "break_eternity.js";

const index = (i: number): Automated => i - 1;
</script>

<style scoped>
.autoBox {
  width: 200px;
  min-height: 200px;
  background-color: hsla(0, 0%, 20%, 60%);
  border: 1px solid hsla(0, 0%, 70%, 80%);
}
</style>

<style>
.btn.toggle {
  padding: 1px;
  border-radius: 0px;
  border-width: 1px !important;
  font-weight: bold;
}
</style>
