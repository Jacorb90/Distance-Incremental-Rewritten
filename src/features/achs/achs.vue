<template>
  <br /><br /><br />
  <q-banner class="bg-dark text-white">
    <h6>
      Achievements: {{ formatWhole(getAchCount()) }} /
      {{ formatWhole(Object.keys(ACH_NAMES).length) }}
    </h6> </q-banner
  ><br /><br />
  <table>
    <tbody>
      <tr v-for="row in ACH_ROWS" :key="row">
        <td v-for="col in ACH_COLS" :key="col">
          <div
            class="ach"
            :class="{ collected: hasAch(row * 10 + col) }"
            v-if="achs.data[row * 10 + col] !== undefined"
          >
            <Tooltip v-if="achs.data[row * 10 + col].value !== undefined">
              <b>{{ ACH_NAMES[row * 10 + col] }}</b>
              <br />
              {{ achs.data[row * 10 + col].value.desc }}
              <div v-if="achs.data[row * 10 + col].value.reward !== undefined">
                <br />
                Reward: {{ achs.data[row * 10 + col].value.reward }}
              </div>
            </Tooltip>
            <span>{{ row * 10 + col }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ACH_NAMES, achs, hasAch, getAchCount } from "./achs";
import { formatWhole } from "@/util/format";
import Tooltip from "@/components/Tooltip.vue";

const ACH_ROWS = 6;
const ACH_COLS = 8;
</script>

<style scoped>
.ach {
  width: 40px;
  height: 40px;
  background-color: rgb(63, 63, 63);
  padding-top: calc(50% - 10px);
  border: 2px solid rgb(145, 116, 116);
}

.ach.collected {
  background-color: #a48326;
  border-color: rgb(116, 145, 116);
}
</style>
