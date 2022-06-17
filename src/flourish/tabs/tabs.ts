import { player } from "@/main";
import { StyleValue } from "vue";

interface TabData {
  name: string;
  style?: StyleValue;
  class?: { [key: string]: boolean };
  condition?: () => boolean;
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
    condition: () => player.featuresUnl.includes("rockets"),
  },
];

export function availableTabs(): TabData[] {
  return TAB_DATA.filter((data) => data.condition?.() ?? true);
}

export function setTab(name: string) {
  player.tab = name;
}
