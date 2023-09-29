<template>
  <div>
    <div class="flexRow">
      <div>
        <br /><br /><br />
        <b
          ><span style="font-size: 1.5em">{{
            formatWhole(player.collapse.cadavers)
          }}</span>
          Cadavers</b
        >, multiplying Time Speed by
        <b>{{ format(collapse.data.eff.value) }}&times;</b>.<br /><br />
        <button
          id="collapse"
          class="btn"
          :class="{ locked: Decimal.lt(collapse.data.resetGain.value, 1) }"
          @click="collapse.actions.collapseUp()"
        >
          Reset all previous progress to gain
          {{ formatWhole(collapse.data.resetGain.value) }} Cadavers.<br />
          <b v-if="Decimal.lt(collapse.data.resetGain.value, 1e3)"
            ><br />Next At: {{ formatDistance(collapse.data.nextAt.value) }}</b
          ></button
        ><br /><br /><br /><br />

        There is
        <b>{{ formatWhole(collapse.data.essence.value) }} Life Essence</b> ({{
          formatWhole(collapse.data.essenceGain.value)
        }}
        per Rank &times; Tier)<br /><br />

        <div
          v-for="r in COLLAPSE_MILESTONE_ROWS"
          :key="r"
          class="row JCstart q-gutter-xs"
        >
          <div
            v-for="id in Object.keys(COLLAPSE_MILESTONE_REQS)
              .filter(
                (id) =>
                  id.startsWith(r.toString()) &&
                  (collapse.data[Number(id)].value.unl ?? true)
              )
              .map(Number)"
            :key="id"
            class="lifeEssenceMilestone"
            :class="{
              earned: player.collapse.milestones.includes(id),
            }"
          >
            <br /><br />
            <b>{{ collapse.data[id].value.description }}</b
            ><br />
            <span v-if="collapse.data[id].value.effect !== undefined"
              >Currently:
              <span v-if="collapse.data[id].value.effectDesc !== undefined">{{
                collapse.data[id].value.effectDesc?.(
                  collapse.data[id].value.effect ?? 1
                )
              }}</span
              ><span v-else
                >{{ format(collapse.data[id].value.effect ?? 1) }}x</span
              ><br /></span
            ><br />
            <span v-if="!player.collapse.milestones.includes(id)"
              >Req: {{ formatWhole(COLLAPSE_MILESTONE_REQS[id]) }} Life
              Essence</span
            >
            <span v-else>EARNED</span>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatWhole, formatDistance, format } from "@/util/format";
import Decimal from "break_eternity.js";
import { player } from "@/main";
import {
  COLLAPSE_MILESTONE_ROWS,
  COLLAPSE_MILESTONE_REQS,
  collapse,
} from "./collapse";
</script>

<style scoped>
#collapse {
  background-color: hsl(262, 50%, 40%);
  border: hsl(251, 50%, 28%) 2px solid;
  padding-left: 5px;
  padding-right: 5px;
  width: 200px;
  min-height: 120px;
  margin-bottom: 3px;
}

#collapse:not(.locked):hover {
  background-color: hsl(257, 25%, 55%);
}

.lifeEssenceMilestone {
  width: 12em;
  height: 15em;
  border: 1px solid grey;
  background-color: rgb(40, 60, 75);
  padding: 0.2em;
  margin: 1px;
}

.lifeEssenceMilestone.earned {
  background-color: rgb(78, 125, 62);
}
</style>
