<template>
  <div id="newsticker" v-if="player?.opts.newsticker ?? false">
    <div id="news" :style="{ right: newsMovement + 'ch' }">
      {{ currentNews }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { doNews } from "./newsticker";
import player from "@/main";

export const currentNews = ref("");
export const newsMovement = ref(0);

export default defineComponent({
  name: "NewsTicker",
  components: {},
  setup() {
    return {
      currentNews,
      newsMovement,
      player,
    };
  },
  mounted() {
    doNews();
  },
});
</script>

<style>
#newsticker {
  height: 18px;
  width: calc(100% - 5px);
  background-color: hsl(0, 0%, 10%);
  border: 2px solid hsl(0, 0%, 30%);
  border-radius: 10%;
  margin: auto;
  overflow: hidden;
  text-align: left;
  position: relative;
}

#news {
  position: absolute;
  right: 100%;
  overflow: hidden;
  display: inline-block;
  white-space: nowrap;
  color: white !important;
  min-height: 18px;
  max-height: 18px;
  transition-duration: 0s;
}
</style>
