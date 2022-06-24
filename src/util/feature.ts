import { player } from "@/main";
import { ComputedRef, watch } from "vue";
import { CreatedSoftcap } from "./softcapped";

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
const featureOrder: string[] = [];

export function signal(sig: Signal, info: number) {
  if (sig === "load")
    featureOrder.forEach((key) => features[key].receptors[sig]?.());
  else featureOrder.forEach((key) => features[key].receptors[sig]?.(info));
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
  featureOrder.forEach((key) => {
    watch(
      features[key].unl.reached,
      (reached) => {
        if (!player.featuresUnl.includes(key) && reached)
          player.featuresUnl.push(key);
      },
      { immediate: true }
    );
  });
}

export function getUnlockDesc() {
  for (const key of featureOrder) {
    if (!player.featuresUnl.includes(key)) return features[key].unl.desc.value;
  }

  return "All features unlocked!";
}

export default features;
