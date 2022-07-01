<template>
  <br /><br /><br />
  <b>{{ formatWhole(player.rocketFuel) }} Rocket Fuel</b><br /><br />
  <button
    id="rocket-fuel"
    class="btn"
    :class="{
      locked: Decimal.lt(player.rockets, rocketFuel.data.cost.value),
    }"
    @click="rocketFuel.actions.fuelUp()"
  >
    Spend your rockets to gain Rocket Fuel.<br /><br />
    <b>Cost: {{ formatWhole(rocketFuel.data.cost.value) }} Rockets</b></button
  ><br /><br /><br />

  <span v-if="Decimal.gte(player.rocketFuel, 1)"
    >Increases effective Rockets by
    {{ format(Decimal.sub(rocketFuel.data.eff1.value, 1).times(100)) }}%.</span
  ><br /><br />
  <span v-if="Decimal.gte(player.rocketFuel, 2)"
    >Decreases the Rank & Rocket requirements by
    {{
      format(
        Decimal.sub(1, Decimal.div(1, rocketFuel.data.eff2.value)).times(100)
      )
    }}%.</span
  ><br /><br />
  <span v-if="Decimal.gte(player.rocketFuel, 3)"
    >Increases Rocket gain by
    {{ format(Decimal.sub(rocketFuel.data.eff3.value, 1).times(100)) }}%.</span
  ><br /><br />
  <span v-if="Decimal.gte(player.rocketFuel, 4)"
    >Increases Rocket effect exponent by
    {{ format(Decimal.sub(rocketFuel.data.eff4.value, 1).times(100)) }}%. </span
  ><br /><br />
  <span v-if="Decimal.gte(player.rocketFuel, 6)"
    >Increases Rocket effect multiplier by
    {{ format(Decimal.sub(rocketFuel.data.eff5.value, 1).times(100)) }}%.
  </span>
</template>

<script setup lang="ts">
import { formatWhole, format } from "@/util/format";
import Decimal from "break_eternity.js";
import { player } from "@/main";
import { rocketFuel } from "./rocketFuel";
</script>

<style scoped>
#rocket-fuel {
  background-color: hsl(30, 15%, 50%);
  border: hsl(0, 0%, 25%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 200px;
  min-height: 120px;
  margin-bottom: 3px;
}

#rocket-fuel:not(.locked):hover {
  background-color: hsl(30, 25%, 65%);
}
</style>
