<template>
  <div>
    <br /><br /><br />
    <button
      id="rocket"
      class="btn"
      :class="{ locked: Decimal.lt(rockets.data.resetGain, 1) }"
      @click="rockets.actions.rocketUp()"
    >
      <b>{{ formatWhole(player.rockets) }} Rockets</b><br /><br />
      Reset all previous progress to gain
      {{ formatWhole(rockets.data.resetGain) }} Rockets.<br /><br />
      Next At: {{ formatDistance(rockets.data.nextAt) }}</button
    ><br /><br /><br />

    Rocket Effect: ((log(x+1)+1)<sup>{{ format(rockets.data.effExp) }}</sup>
    &times; {{ format(rockets.data.effMult) }}<br /><br />

    Maximum Velocity: {{ format(rockets.data.maxVelMult) }}x<br />
    Acceleration: {{ format(rockets.data.accMult) }}x<br /><br />
  </div>
</template>

<script setup lang="ts">
import { formatWhole, format, formatDistance } from "@/util/format";
import Decimal from "break_eternity.js";
import { player } from "@/main";
import { rockets } from "./rockets";
</script>

<style scoped>
#rocket:not(.locked) {
  background-color: hsl(0, 0%, 40%);
  border: hsl(0, 0%, 25%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 200px;
  min-height: 120px;
  margin-bottom: 3px;
}

#rocket:not(.locked):hover {
  background-color: hsl(0, 0%, 65%);
}
</style>
