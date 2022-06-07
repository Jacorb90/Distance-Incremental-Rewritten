import { DecimalSource } from "break_eternity.js";

interface TabData {
  main: number;
  opt: number;
}

interface OptData {
  notation: number;
  distanceFormat: number;
  theme: number;
  autoSave: boolean;
  newsticker: boolean;
  hotkeys: boolean;
}

export interface Save {
  tabs: TabData;
  version: number;
  achs: number[];
  saveID: number;
  opts: OptData;
  modes: string[];
  lastTime: number;
  timePlayed: number;
  distance: DecimalSource;
  velocity: DecimalSource;
  rank: DecimalSource;
  tier: DecimalSource;
  rockets: DecimalSource;
  rocketFuel: DecimalSource;
}

interface MetaSave {
  saveCount: number;
  currentSave: number;
  saves: {
    [key: number]: Save;
  };
}

const LOCALSTORAGE_NAME = "dist-inc-rewrite-go-brrrr";

function createSaveID(times = 0) {
  return Math.floor(Math.abs(Math.sin(times * 1e10) * 1e10));
}

function startingMetaSave(): MetaSave {
  const id = createSaveID();

  return {
    saveCount: 1,
    currentSave: id,
    saves: {
      [id]: startingSave(id),
    },
  };
}

function startingSave(saveID: number, modes: string[] = []): Save {
  return {
    tabs: {
      main: 0,
      opt: 0,
    },
    version: 1.0,
    achs: [],
    saveID,
    opts: {
      notation: 0,
      distanceFormat: 0,
      theme: 0,
      autoSave: true,
      newsticker: true,
      hotkeys: true,
    },
    modes,
    lastTime: new Date().getTime(),
    timePlayed: 0,
    distance: 0,
    velocity: 0,
    rank: 1,
    tier: 0,
    rockets: 0,
    rocketFuel: 0,
  };
}

export function versionControl(save: Save) {
  // version control shenanigans here

  save.version = startingSave(0).version;
}

export function loadSave(): MetaSave {
  const data = localStorage.getItem(LOCALSTORAGE_NAME);

  if (data === null) return startingMetaSave();
  else {
    try {
      return JSON.parse(atob(data));
    } catch (e) {
      alert(
        "It seems as though your save cannot be loaded! Please check the console for details!"
      );
      throw e;
    }
  }
}

export function saveGame(metaSave: MetaSave) {
  localStorage.setItem(LOCALSTORAGE_NAME, btoa(JSON.stringify(metaSave)));
}
