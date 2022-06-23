import { player } from "@/main";
import { ComputedRef, watch } from "vue";

type Signal = "tick" | "reset" | "load";

interface Receptors {
  tick?: (diff: number) => void;
  reset?: (reset: number) => void;
  load?: () => void;
}

export interface Feature<
  Data,
  Actions = {},
  ComputedData = { [key in keyof Data]: ComputedRef<Data[key]> }
> {
  unl: {
    reached: ComputedRef<boolean>;
    desc: ComputedRef<string>;
  };
  data: ComputedData;
  receptors: Receptors;
  actions: Actions;
}

const features: Record<string, Feature<unknown, unknown>> = {};

export function signal(sig: Signal, info: number) {
  if (sig === "load") {
    for (const key in features) {
      features[key].receptors[sig]?.();
    }
  } else {
    for (const key in features) {
      features[key].receptors[sig]?.(info);
    }
  }
}

export function addFeature<T, A>(name: string, feature: Feature<T, A>) {
  features[name] = feature;

  return features[name] as Feature<T, A>;
}

export function watchUnlocks() {
  for (const key in features) {
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
  for (const key in features) {
    if (!player.featuresUnl.includes(key)) return features[key].unl.desc.value;
  }

  return "All features unlocked!";
}

export default features;
