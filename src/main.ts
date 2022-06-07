import { createApp, ref, Ref } from "vue";
import App from "./App.vue";
import { checkNextNews } from "./flourish/newsticker/newsticker";
import { newsMovement } from "./flourish/newsticker/newsticker.vue";
import { Save } from "./saveload";
import { signal } from "./util/feature";

const player: Ref<Save | undefined> = ref(undefined);

export function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (player.value === undefined) return;

  const currentTime = new Date().getTime();
  const diff = (currentTime - player.value.lastTime) / 1000;
  player.value.lastTime = currentTime;

  signal("tick", diff);

  if (player?.value.opts.newsticker) {
    newsMovement.value += diff * 5;
    checkNextNews();
  }
}

export default player;

createApp(App).mount("#app");
