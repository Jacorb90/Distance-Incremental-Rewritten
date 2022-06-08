import player from "@/main";
import { StyleValue } from "vue";

interface TabData {
  name: string;
  style?: StyleValue;
  condition?: () => boolean;
}

const TAB_DATA: TabData[] = [
  {
    name: "Options",
  },
];

export function availableTabs(): TabData[] {
  return TAB_DATA.filter((data) => data.condition?.() ?? true);
}

export function setTab(name: string) {
  if (player.value !== undefined) {
    player.value.tab = name;
  }
}
