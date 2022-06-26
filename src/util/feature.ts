import { player } from "@/main";
import { watch } from "vue";

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
} & FurtherOptions;

const features: Record<string, Feature<unknown, unknown>> = {};
const featureOrder: Record<number, string> = {};

export function signal(sig: Signal, info: number) {
  if (sig === "load") {
    for (const index in featureOrder)
      features[featureOrder[index]].receptors[sig]?.();
  } else {
    for (const index in featureOrder)
      features[featureOrder[index]].receptors[sig]?.(info);
  }
}

export function addFeature<T, A, FO>(
  name: string,
  index: number,
  feature: Feature<T, A, FO>
) {
  features[name] = feature;
  featureOrder[index] = name;

  return features[name] as Feature<T, A, FO>;
}

export function watchUnlocks() {
  for (const index in featureOrder) {
    const key = featureOrder[index];
    watch(
      features[key].unl.reached,
      (reached) => {
        if (!player.featuresUnl.includes(key) && reached)
          player.featuresUnl.push(key);
      },
      { immediate: true }
    );
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
