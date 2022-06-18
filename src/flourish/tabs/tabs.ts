import { player } from "@/main";
import { computed, ComputedRef } from "@vue/reactivity";
import { StyleValue } from "vue";

interface TabData {
  name: string;
  style?: StyleValue;
  class?: { [key: string]: boolean };
  condition?: ComputedRef<boolean>;
}

const TAB_DATA: TabData[] = [
  {
    name: "Options",
  },
  {
    name: "Rockets",
    class: {
      rockets: true,
    },
    condition: computed(() => player.featuresUnl.includes("rockets")),
  },
];

export function availableTabs(): TabData[] {
  return TAB_DATA.filter((data) => data.condition?.value ?? true);
}

export function setTab(name: string) {
  player.tab = name;
}
