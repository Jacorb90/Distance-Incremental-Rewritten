<template>
  <div v-for="tab in availableTabs()" :key="tab.name">
    <button
      class="btn tb"
      :style="tab.style ?? []"
      :class="tab.class ?? { main: true }"
      @click="setTab(tab.name)"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { availableTabs, setTab } from "./tabs";
</script>

<style>
.btn {
  background-color: hsl(140, 30%, 20%);
  border-radius: 10px;
  border: hsl(140, 30%, 10%) medium solid;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-size: 12px;
  max-width: 200px;
  padding: 7px 25px;
  text-decoration: none;
}

.btn * {
  cursor: pointer;
}

.btn:hover {
  background-color: hsl(140, 30%, 30%);
}

.btn:active {
  position: relative;
  top: 3px;
  left: 2px;
  box-shadow: none;
}

.btn.neg {
  background-color: hsl(0, 30%, 20%) !important;
  border: hsl(0, 30%, 10%) medium solid !important;
}

.btn.neg:hover {
  background-color: hsl(0, 30%, 30%) !important;
}

.btn.locked {
  background-color: hsl(0, 30%, 20%) !important;
  border-radius: 10px;
  border: hsl(0, 30%, 10%) medium solid !important;
  display: inline-block !important;
  cursor: not-allowed;
  color: #ffffff;
  font-size: 12px;
  max-width: 200px;
  padding: 7px 25px;
  text-decoration: none;
}

.btn.locked * {
  cursor: not-allowed !important;
}

.btn.locked:hover {
  background-color: hsl(0, 30%, 30%) !important;
}

.btn.locked:active {
  position: relative;
  top: 3px;
  left: 2px;
  box-shadow: none;
}

.btn.bought {
  background-color: hsl(60, 30%, 20%) !important;
  border-radius: 10px;
  border: hsl(60, 30%, 10%) medium solid !important;
  display: inline-block !important;
  cursor: default;
  color: #ffffff;
  font-size: 12px;
  max-width: 200px;
  padding: 7px 25px;
  text-decoration: none;
}

.btn.bought * {
  cursor: default !important;
}

.btn.bought:hover {
  background-color: hsl(60, 30%, 20%) !important;
}

.btn.bought:active {
  top: 0px;
  left: 0px;
}

.btn.tb {
  background-color: hsl(0, 0%, 20%);
  border: hsl(0, 0%, 30%) solid medium;
  border-left: none !important;
  border-radius: 10px !important;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-size: 10px !important;
  max-width: 100px !important;
  padding: 4px 12px !important;
  text-decoration: none;
}

.btn.tb:hover {
  background-color: hsl(0, 0%, 30%);
}

.btn.tb:active {
  position: relative;
  top: 3px !important;
  left: 2px !important;
  box-shadow: none;
}

.right .btn.tb {
  width: 100% !important;
  max-width: 100% !important;
  border-radius: 0 !important;
  height: 50px !important;
  font-size: 15px !important;
}

.right .btn.tb.small {
  height: 30px !important;
  font-size: 12px !important;
  background-color: hsl(0, 0%, 70%);
  border: hsl(0, 0%, 60%) solid medium;
  color: hsl(0, 0%, 10%);
}

.right .btn.tb:active {
  top: 0 !important;
  left: 0 !important;
}

.btn.rockets {
  background-color: hsl(0, 0%, 35%);
}

.btn.rockets:hover {
  background-color: hsl(0, 0%, 50%);
}

.btn.auto {
  background-color: hsl(100, 10%, 20%);
}

.btn.auto:hover {
  background-color: hsl(100, 10%, 35%);
}

.btn.tr {
  background-color: hsl(300, 50%, 20%);
  border-color: hsl(300, 50%, 40%);
}

.btn.tr:hover {
  background-color: hsl(300, 50%, 35%);
  border-color: hsl(300, 50%, 60%);
}

.btn.collapse {
  background-color: hsl(267, 51%, 20%);
  border-color: hsl(244, 50%, 40%);
}

.btn.collapse:hover {
  background-color: hsl(235, 50%, 35%);
  border-color: hsl(254, 50%, 60%);
}

.btn.pathogens {
  background-color: hsl(66, 51%, 20%);
  border-color: hsl(67, 50%, 40%);
}

.btn.pathogens:hover {
  background-color: hsl(67, 50%, 40%);
  border-color: hsl(66, 51%, 20%);
}
</style>
