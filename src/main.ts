import { createApp, ref, Ref } from "vue";
import App from "./App.vue";
import { checkNextNews } from "./flourish/newsticker/newsticker";
import { newsMovement } from "./flourish/newsticker/newsticker.vue";
import { MetaSave, Save, startingMetaSave, startingSave } from "./saveload";
import { signal, updateUnlocks } from "./util/feature";

export const metaSave: Ref<MetaSave> = ref(startingMetaSave());
const player: Ref<Save> = ref(startingSave(0));

export function gameLoop() {
  requestAnimationFrame(gameLoop);

  const currentTime = new Date().getTime();
  const diff = (currentTime - player.value.lastTime) / 1000;
  player.value.lastTime = currentTime;

  updateUnlocks();

  signal("tick", diff);

  if (player.value.opts.newsticker) {
    newsMovement.value += diff * 8;
    checkNextNews();
  }
}

export default player;

createApp(App).mount("#app");
