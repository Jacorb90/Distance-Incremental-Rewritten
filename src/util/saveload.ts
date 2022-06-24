import { DecimalSource } from "break_eternity.js";
import { toRaw } from "vue";
import { metaSave, player } from "../main";
import { Notify } from "quasar";

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
      alpha: "1.1.2",
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
  };
}

export function versionControl() {
  // version control shenanigans here

  player.version = startingSave(0).version;
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
