import { player } from "@/main";
import { ComputedRef } from "vue";

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

/* eslint-disable @typescript-eslint/no-explicit-any */
const features: { [key: string]: Feature<any, any> } = {};
const featureOrder: { [key: number]: string } = {};

export function signal(sig: Signal, info: number) {
  if (sig === "load") {
    for (const i in featureOrder) {
      features[featureOrder[i]].receptors[sig]?.();
    }
  } else {
    for (const i in featureOrder) {
      features[featureOrder[i]].receptors[sig]?.(info);
    }
  }
}

export function addFeature<T, A>(
  name: string,
  index: number,
  feature: Feature<T, A>
): Feature<T, A> {
  features[name] = feature;
  featureOrder[index] = name;
  return features[name] as Feature<T, A>;
}

export function updateUnlocks() {
  for (const i in featureOrder) {
    const key = featureOrder[i];
    if (!player.featuresUnl.includes(key) && features[key].unl.reached.value)
      player.featuresUnl.push(key);
  }
}

export function getUnlockDesc(): string {
  for (const i in featureOrder) {
    const key = featureOrder[i];
    if (!player.featuresUnl.includes(key)) return features[key].unl.desc.value;
  }

  return "All features unlocked!";
}

export default features;
