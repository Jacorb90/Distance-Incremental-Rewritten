<template>
  <br /><br />
  <div class="flexRow">
    <div
      v-if="
        Object.keys(RANK_DESCS).some((req) => Decimal.gte(player.rank, req))
      "
      style="border: 1px solid white"
    >
      <div
        style="
          border-top: 1px solid white;
          border-bottom: 1px solid white;
          padding: 5px;
          width: 100%;
          background-color: hsl(190, 20%, 20%);
        "
      >
        <b>RANKS</b>
      </div>
      <div v-for="(desc, key) in RANK_DESCS" :key="key" style="width: 100%">
        <div
          style="
            border-top: 1px solid white;
            border-bottom: 1px solid white;
            width: 100%;
            padding: 5px;
            text-align: left;
            background-color: hsl(190, 20%, 10%);
          "
          v-if="Decimal.gte(player.rank, key)"
        >
          <span style="border-right: 1px solid white"
            >Rank {{ formatWhole(key) }}&nbsp;</span
          >
          {{ desc.value }}
        </div>
      </div>
    </div>

    <div
      v-if="
        Object.keys(TIER_DESCS).some((req) => Decimal.gte(player.tier, req))
      "
      style="border: 1px solid white"
    >
      <div
        style="
          border-top: 1px solid white;
          border-bottom: 1px solid white;
          padding: 5px;
          width: 100%;
          background-color: hsl(65, 20%, 20%);
        "
      >
        <b>TIERS</b>
      </div>
      <div v-for="(desc, key) in TIER_DESCS" :key="key" style="width: 100%">
        <div
          style="
            border-top: 1px solid white;
            border-bottom: 1px solid white;
            width: 100%;
            padding: 5px;
            text-align: left;
            background-color: hsl(65, 20%, 10%);
          "
          v-if="Decimal.gte(player.tier, key)"
        >
          <span style="border-right: 1px solid white"
            >Tier {{ formatWhole(key) }}&nbsp;</span
          >
          {{ desc.value }}
        </div>
      </div>
    </div>
  </div>
  <br />
</template>

<script setup lang="ts">
import Decimal from "break_eternity.js";
import { player } from "@/main";
import { formatWhole } from "@/util/format";
import { RANK_DESCS, TIER_DESCS } from "@/features/basics/basics";
</script>
