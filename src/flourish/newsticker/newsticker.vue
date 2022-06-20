<template>
  <div id="newsticker" v-if="player.opts.newsticker">
    <div id="news" :style="{ right: newsMovement + 'ch' }">
      {{ currentNews }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { doNews, currentNews, newsMovement } from "./newsticker";
import { player } from "@/main";

doNews();
</script>

<style>
#newsticker {
  height: 26px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 100%;
  background-color: hsl(0, 0%, 10%);
  border: 2px solid hsl(0, 0%, 30%);
  border-left: none;
  border-right: none;
  border-radius: 10%;
  margin: 0;
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
  min-height: 26px;
  max-height: 26px;
  transition-duration: 0s;
}
</style>
