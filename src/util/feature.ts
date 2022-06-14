import player from "@/main";
import { Ref, ref } from "vue";

type Signal = "tick" | "reset" | "load";

interface Receptors {
  tick?: (diff: number) => void;
  reset?: (reset: number) => void;
  load?: () => void;
}

export interface Feature<T, A = {}, S = { [key in keyof T]: () => T[key] }> {
  unl: {
    reached: () => boolean;
    desc: () => string;
  };
  data: T;
  values: S;
  receptors: Receptors;
  actions: A;
  deferred?: (keyof T)[];
}

// ignore-next-line no-explicit-any
const features: Ref<{ [key: string]: Feature<any, any> }> = ref({});
const featureOrder: { [key: number]: string } = {};

export function signal(sig: Signal, info: number) {
  if (sig === "load") {
    for (const i in featureOrder) {
      features.value[featureOrder[i]].receptors[sig]?.();
    }
    reloadAllFeatures();
  } else {
    for (const i in featureOrder) {
      features.value[featureOrder[i]].receptors[sig]?.(info);
    }
    if (sig === "reset") reloadAllFeatures();
  }
}

export function reloadData<T, A>(feature: Feature<T, A>, name: keyof T) {
  feature.data[name] = feature.values[name]();
}

export function reloadAllData<T, A>(feature: Feature<T, A>, deferred: boolean) {
  for (const k in feature.data) {
    if ((feature.deferred?.includes(k) ?? false) === deferred)
      reloadData(feature, k);
  }
}

export function reloadAllFeatures() {
  for (const i in featureOrder) {
    reloadAllData(features.value[featureOrder[i]], false);
  }

  for (const i in featureOrder) {
    reloadAllData(features.value[featureOrder[i]], true);
  }
}

export function addFeature<T, A>(
  name: string,
  index: number,
  feature: Feature<T, A>
): Feature<T, A> {
  features.value[name] = feature;
  featureOrder[index] = name;
  return features.value[name] as Feature<T, A>;
}

export function updateUnlocks() {
  for (const i in featureOrder) {
    const key = featureOrder[i];
    if (
      !player.value.featuresUnl.includes(key) &&
      features.value[key].unl.reached()
    )
      player.value.featuresUnl.push(key);
  }
}

export function getUnlockDesc(): string {
  for (const i in featureOrder) {
    const key = featureOrder[i];
    if (!player.value.featuresUnl.includes(key))
      return features.value[key].unl.desc();
  }

  return "All features unlocked!";
}

export default features;
