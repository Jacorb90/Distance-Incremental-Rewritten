<template>
  <div v-for="tab in tabs" :key="tab.name">
    <button
      class="btn tb main"
      :style="tab.style ?? []"
      @click="setTab(tab.name)"
    >
      {{ tab.name }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { availableTabs, setTab } from "./tabs";

export default defineComponent({
  name: "Tabs",
  components: {},
  setup() {
    const tabs = availableTabs();

    return {
      tabs,
      setTab,
    };
  },
});
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

.btn:hover {
  background-color: hsl(140, 30%, 30%);
}

.btn:active {
  position: relative;
  top: 3px;
  left: 2px;
  box-shadow: none;
}

.btn.locked {
  background-color: hsl(0, 30%, 20%);
  border-radius: 10px;
  border: hsl(0, 30%, 10%) medium solid;
  display: inline-block;
  cursor: not-allowed;
  color: #ffffff;
  font-size: 12px;
  max-width: 200px;
  padding: 7px 25px;
  text-decoration: none;
}

.btn.locked:hover {
  background-color: hsl(0, 30%, 30%);
}

.btn.locked:active {
  position: relative;
  top: 3px;
  left: 2px;
  box-shadow: none;
}

.btn.tb {
  background-color: hsl(0, 0%, 20%);
  border: hsl(0, 0%, 30%) solid medium;
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
</style>
