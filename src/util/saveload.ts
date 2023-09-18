import { toRaw } from "vue";
import { metaSave, player } from "../main";
import { Notify } from "quasar";
import { generateInitialAutoState } from "@/features/auto/auto";

import type { DecimalSource } from "break_eternity.js";
import { Automated } from "@/features/auto/auto";

export interface Version {
  alpha?: string;
  beta?: string;
  release?: string;
}

interface OptData {
  notation: number;
  distanceFormat: number;
  theme: number;
  autoSave: boolean;
  offlineTime: boolean;
  newsticker: boolean;
  hotkeys: boolean;
}

export type Save = {
  tab: string | null;
  version: Version;
  achs: number[];
  saveID: number;
  saveName: string;
  opts: OptData;
  modes: string[];
  lastTime: number;
  timePlayed: number;
  featuresUnl: string[];
  distance: DecimalSource;
  velocity: DecimalSource;
  rank: DecimalSource;
  tier: DecimalSource;
  rockets: DecimalSource;
  rocketFuel: DecimalSource;
  auto: Record<
    Automated,
    {
      unl: boolean;
      active: boolean;
      mastered: boolean;
      level: DecimalSource;
    }
  >;
  timeReversal: {
    active: boolean;
    cubes: DecimalSource;
    upgrades: number[];
  };
};

export interface MetaSave {
  currentSave: number;
  saves: Record<number, Save>;
}

const LOCALSTORAGE_NAME = "dist-inc-rewrite-go-brrrr";

function createSaveID(times = 0) {
  return Math.floor(Math.abs(Math.sin(times * 1e10) * 1e10));
}

export function startingMetaSave(): MetaSave {
  const id = createSaveID();

  return {
    currentSave: id,
    saves: {
      [id]: startingSave(id),
    },
  };
}

export function startingSave(saveID: number, modes: string[] = []): Save {
  return {
    tab: null,
    version: {
      alpha: "1.3.1",
    },
    achs: [],
    saveID,
    saveName: "Save #" + saveID,
    opts: {
      notation: 0,
      distanceFormat: 0,
      theme: 0,
      autoSave: true,
      offlineTime: true,
      newsticker: true,
      hotkeys: true,
    },
    modes,
    lastTime: Date.now(),
    timePlayed: 0,
    featuresUnl: [],
    distance: 0,
    velocity: 0,
    rank: 1,
    tier: 0,
    rockets: 0,
    rocketFuel: 0,
    auto: generateInitialAutoState(),
    timeReversal: {
      active: false,
      cubes: 0,
      upgrades: [],
    },
  };
}

export function versionControl() {
  const start = startingSave(0);

  player.version = start.version;
}

export function loadSave(): MetaSave {
  const data = localStorage.getItem(LOCALSTORAGE_NAME);

  if (data === null) return startingMetaSave();
  else {
    try {
      return JSON.parse(atob(data));
    } catch (e) {
      Notify.create({
        message: "Load Error!",
        position: "top-right",
        type: "danger",
        timeout: 5000,
        badgeStyle: "opacity: 0;",
      });
      throw e;
    }
  }
}

export function saveGame(setMeta = true, auto = false) {
  if (setMeta) metaSave.saves[metaSave.currentSave] = toRaw(player);
  localStorage.setItem(LOCALSTORAGE_NAME, btoa(JSON.stringify(metaSave)));

  if (!auto) {
    Notify.create({
      message: "Game saved!",
      position: "top-right",
      type: "positive",
      timeout: 1000,
      badgeStyle: "opacity: 0;",
    });
  }
}

export function loadSpecificSave(id: number) {
  metaSave.currentSave = id;
  saveGame(false);

  location.reload();
}

export function deleteSpecificSave(id: number) {
  if (!confirm("Are you sure you want to delete this save?")) return;

  delete metaSave.saves[id];
  if (metaSave.currentSave == id) {
    metaSave.currentSave = Math.max(metaSave.currentSave - 1, 0);
    loadSpecificSave(metaSave.currentSave);
  }

  Notify.create({
    message: "Save deleted!",
    position: "top-right",
    type: "negative",
    timeout: 2000,
    badgeStyle: "opacity: 0;",
  });
}

export function getVersionDisplay(v: Version) {
  let display = "";

  if (v.release !== undefined) display += "v" + v.release + " ";
  if (v.beta !== undefined) display += "β" + v.beta + " ";
  if (v.alpha !== undefined) display += "α" + v.alpha;

  return display;
}

/*function vStringLT(vs1: string, vs2: string) {
  const vs1split = vs1.split(".").map(Number);
  const vs2split = vs2.split(".").map(Number);

  for (let i = 0; i < vs2split.length; i++) {
    if ((vs1split[i] ?? 0) < vs2split[i]) return true;
    else if ((vs1split[i] ?? 0) > vs2split[i]) return false;
  }

  return false;
}

function versionLT(v1: Version, v2: Version) {
  const keys: (keyof Version)[] = ["release", "beta", "alpha"];

  for (let i = 0; i < keys.length; i++) {
    const v1k = v1[keys[i]];
    const v2k = v2[keys[i]];

    if (v2k !== undefined) {
      if (v1k === undefined) return true;
      else if (vStringLT(v1k, v2k)) return true;
      else if (vStringLT(v2k, v1k)) return false;
    }
  }

  return false;
}*/
