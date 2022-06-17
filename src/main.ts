import { createApp, reactive } from "vue";
import App from "./App.vue";
import { checkNextNews, newsMovement } from "./flourish/newsticker/newsticker";
import {
  loadSave,
  MetaSave,
  Save,
  saveGame,
  startingMetaSave,
  startingSave,
  versionControl,
} from "./saveload";
import { signal, updateUnlocks } from "./util/feature";

export const metaSave: MetaSave = reactive(startingMetaSave());
export const player: Save = reactive(startingSave(0));

export function gameLoop() {
  requestAnimationFrame(gameLoop);

  const currentTime = new Date().getTime();
  const diff = (currentTime - player.lastTime) / 1000;
  player.lastTime = currentTime;

  updateUnlocks();

  signal("tick", diff);

  if (player.opts.newsticker) {
    newsMovement.value += diff * 8;
    checkNextNews();
  }
}

export function load() {
  document.title = "Distance Incremental Rewritten";

  Object.assign(metaSave, loadSave());
  Object.assign(
    player,
    metaSave.saves[metaSave.currentSave] ?? startingSave(metaSave.currentSave)
  );
  versionControl();

  if (!player.opts.offlineTime) player.lastTime = new Date().getTime();

  signal("load", 0);

  gameLoop();

  setInterval(() => {
    if (player.opts.autoSave) saveGame();
  }, 5000);
}

createApp(App).mount("#app");
