import { player } from "@/main";
import { watchEffect } from "vue";

import type { ComputedRef } from "vue";

type Signal = "tick" | "reset" | "load";

interface Receptors {
  tick?: (diff: number) => void;
  reset?: (reset: number) => void;
  load?: () => void;
}

export type Feature<
  Data,
  Actions = {},
  FurtherOptions = {},
  ComputedData = { [key in keyof Data]: ComputedRef<Data[key]> }
> = {
  unl: {
    reached: ComputedRef<boolean>;
    desc: ComputedRef<string>;
  };
  data: ComputedData;
  receptors: Receptors;
  actions: Actions;
  watchers?: (() => void)[];
} & FurtherOptions;

const features: Record<string, Feature<unknown, unknown>> = {};
const featureOrder: Record<number, string> = {};

export function signal(sig: Signal, info: number) {
  switch (sig) {
    case "load":
      for (const index in featureOrder)
        features[featureOrder[index]].receptors[sig]?.();
      break;

    default:
      for (const index in featureOrder)
        features[featureOrder[index]].receptors[sig]?.(info);
      break;
  }
}

export function addFeature<T, A, FO, CD>(
  name: string,
  index: number,
  feature: Feature<T, A, FO, CD>
) {
  features[name] = feature;
  featureOrder[index] = name;

  return features[name] as Feature<T, A, FO, CD>;
}

export function setupWatchers() {
  for (const index in featureOrder) {
    const key = featureOrder[index];
    const feature = features[key];

    watchEffect(() => {
      if (!player.featuresUnl.includes(key) && feature.unl.reached.value)
        player.featuresUnl.push(key);
    });

    if (feature.watchers !== undefined) {
      for (const wKey in feature.watchers) {
        watchEffect(feature.watchers[wKey]);
      }
    }
  }
}

export function getUnlockDesc() {
  for (const index in featureOrder) {
    const key = featureOrder[index];
    if (!player.featuresUnl.includes(key)) return features[key].unl.desc.value;
  }

  return "All features unlocked!";
}

export default features;
