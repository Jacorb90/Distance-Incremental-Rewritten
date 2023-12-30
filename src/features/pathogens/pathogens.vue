<template>
  <br /><br />
  There are <b>{{ format(player.pathogens.amount) }} Pathogens</b>, which
  multiply Pathogen gain by
  <b>{{ format(pathogens.data.pathogenEff.value) }}&times;</b><br /><br />
  <i>(+{{ format(pathogens.data.pathogenGain.value) }}/s)</i><br /><br /><br />

  <i
    >Total Pathogen Upgrades:
    {{ formatWhole(pathogens.data.totalUpgs.value) }}</i
  ><br /><br />

  <div v-for="(row, i) in PATHOGEN_UPGS" class="flexRow center" :key="i">
    <button
      v-for="id in row.filter((i) => pathogens.data[i].value.unl ?? true)"
      @click="pathogens.actions.buyPathogenUpg(id, true)"
      :key="id"
      class="btn"
      :class="{
        pathogens: Decimal.gte(
          player.pathogens.amount,
          pathogenUpgCostFormulas[id].cost.value
        ),
        locked: Decimal.lt(
          player.pathogens.amount,
          pathogenUpgCostFormulas[id].cost.value
        ),
      }"
    >
      <b
        >{{ pathogens.data[id].value.name }} [{{
          formatWhole(player.pathogens.upgrades[id] ?? 0)
        }}<span v-if="Decimal.gt(pathogens.data[id].value.extra ?? 0, 0)">
          + {{ formatWhole(pathogens.data[id].value.extra ?? 0) }}</span
        >]</b
      ><br /><br />

      {{ pathogens.data[id].value.description }}<br />
      Currently: {{ pathogens.data[id].value.effectDesc }}<br /><br />

      Cost:
      {{ format(pathogenUpgCostFormulas[id].accCost.value) }} Pathogens<br />
    </button>
  </div>

  <br /><br />
</template>

<script setup lang="ts">
import { player } from "@/main";
import { format, formatWhole } from "@/util/format";
import { PATHOGEN_UPGS, pathogens, pathogenUpgCostFormulas } from "./pathogens";
import Decimal from "break_eternity.js";
</script>
