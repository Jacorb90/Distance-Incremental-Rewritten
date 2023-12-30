import { player } from "@/main";
import { computed } from "@vue/reactivity";

import type { ComputedRef } from "@vue/reactivity";
import type { StyleValue } from "vue";

interface TabData {
  name: string;
  style?: StyleValue;
  class?: Record<string, boolean>;
  condition?: ComputedRef<boolean>;
}

const TAB_DATA: TabData[] = [
  {
    name: "Options",
  },
  {
    name: "Stats",
  },
  {
    name: "Achievements",
  },
  {
    name: "Rockets",
    class: {
      rockets: true,
    },
    condition: computed(() => player.featuresUnl.includes("rockets")),
  },
  {
    name: "Automation",
    class: {
      auto: true,
    },
    condition: computed(() => player.featuresUnl.includes("auto")),
  },
  {
    name: "Time Reversal",
    class: {
      tr: true,
    },
    condition: computed(() => player.featuresUnl.includes("timeReversal")),
  },
  {
    name: "Collapse",
    class: {
      collapse: true,
    },
    condition: computed(() => player.featuresUnl.includes("collapse")),
  },
  {
    name: "Pathogens",
    class: {
      pathogens: true,
    },
    condition: computed(() => player.featuresUnl.includes("pathogens")),
  },
];

export function availableTabs(): TabData[] {
  return TAB_DATA.filter((data) => data.condition?.value ?? true);
}

export function setTab(name: string) {
  player.tab = name;
}
