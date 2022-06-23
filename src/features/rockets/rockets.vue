<template>
  <div>
    <div class="flexRow">
      <div>
        <br /><br /><br />
        <b>{{ formatWhole(player.rockets) }} Rockets</b><br /><br />
        <button
          id="rocket"
          class="btn"
          :class="{ locked: Decimal.lt(rockets.data.resetGain.value, 1) }"
          @click="rockets.actions.rocketUp()"
        >
          Reset all previous progress to gain
          {{ formatWhole(rockets.data.resetGain.value) }} Rockets.<br /><br />
          <b
            >Next At: {{ formatDistance(rockets.data.nextAt.value) }}</b
          ></button
        ><br /><br /><br />

        Rocket Effect: ((log(x+1)+1)<sup>{{
          format(rockets.data.effExp.value)
        }}</sup>
        &times; {{ format(rockets.data.effMult.value) }}
        <span class="softcapped">{{
          ROCKET_EFF_EXP_SOFTCAP.display(rockets.data.effExp.value)
        }}</span
        ><br /><br />

        Maximum Velocity: {{ format(rockets.data.maxVelMult.value) }}x<br />
        Acceleration: {{ format(rockets.data.accMult.value) }}x<br /><br />
      </div>

      <div v-if="hasAch(24)">
        <br /><br /><br />
        <b>{{ formatWhole(player.rocketFuel) }} Rocket Fuel</b><br /><br />
        <button
          id="rocket-fuel"
          class="btn"
          :class="{
            locked: Decimal.lt(player.rockets, rockets.data.rfCost.value),
          }"
          @click="rockets.actions.fuelUp()"
        >
          Spend your rockets to gain Rocket Fuel.<br /><br />
          <b
            >Cost: {{ formatWhole(rockets.data.rfCost.value) }} Rockets</b
          ></button
        ><br /><br /><br />

        <span v-if="Decimal.gte(player.rocketFuel, 1)"
          >Increases effective Rockets by
          {{
            format(Decimal.sub(rockets.data.rfEff1.value, 1).times(100))
          }}%.</span
        ><br /><br />
        <span v-if="Decimal.gte(player.rocketFuel, 2)"
          >Decreases the Rank & Rocket requirements by
          {{
            format(
              Decimal.sub(1, Decimal.div(1, rockets.data.rfEff2.value)).times(
                100
              )
            )
          }}%.</span
        ><br /><br />
        <span v-if="Decimal.gte(player.rocketFuel, 3)"
          >Increases Rocket gain by
          {{
            format(Decimal.sub(rockets.data.rfEff3.value, 1).times(100))
          }}%.</span
        ><br /><br />
        <span v-if="Decimal.gte(player.rocketFuel, 4)"
          >Increases Rocket effect exponent by
          {{
            format(Decimal.sub(rockets.data.rfEff4.value, 1).times(100))
          }}%.</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatWhole, format, formatDistance } from "@/util/format";
import Decimal from "break_eternity.js";
import { player } from "@/main";
import { rockets, ROCKET_EFF_EXP_SOFTCAP } from "./rockets";
import { hasAch } from "../achs/achs";
</script>

<style scoped>
#rocket {
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

<style>
.softcapped {
  color: hsl(79, 100%, 57%);
  font-weight: bold;
  text-shadow: 0px 2px 2px hsl(79, 100%, 23%);
}
</style>
