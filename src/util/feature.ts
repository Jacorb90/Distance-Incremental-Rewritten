import basics from "@/features/basics/basics";
import { DefineComponent } from "vue";

type Signal = "tick" | "reset" | "load";

interface Receptors {
  tick?: (diff: number) => void;
  reset?: (reset: number) => void;
  load?: () => void;
}

export interface Feature<T, S = { [key in keyof T]: () => T[key] }> {
  data: T;
  values: S;
  receptors: Receptors;
  component: DefineComponent<{}, {}, any>;
}

export function signal(sig: Signal, info: number) {
  if (sig === "load") {
    let key: keyof typeof features;
    for (key in features) {
      reloadAllData(features[key]);
      features[key].receptors[sig]?.();
    }
  } else {
    let key: keyof typeof features;
    for (key in features) {
      features[key].receptors[sig]?.(info);
    }
  }
}

export function reloadData<T>(feature: Feature<T>, name: keyof T) {
  feature.data[name] = feature.values[name]();
}

export function reloadAllData<T>(feature: Feature<T>) {
  for (const k in feature.data) {
    reloadData(feature, k);
  }
}

const features = {
  basics,
};
