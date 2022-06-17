import { player } from "@/main";
import features, { addFeature, reloadData, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import Decimal, { DecimalSource } from "break_eternity.js";
import { ref } from "vue";
import { basics } from "../basics/basics";

interface RocketData {
  resetGain: DecimalSource;
  nextAt: DecimalSource;
  effExp: DecimalSource;
  effMult: DecimalSource;
  maxVelMult: DecimalSource;
  accMult: DecimalSource;
}

interface RocketActions {
  rocketUp: () => void;
}

addFeature<RocketData, RocketActions>("rockets", 1, {
  unl: {
    reached: () => Decimal.gte(player.distance, 1e6),
    desc: () => "Reach " + formatDistance(1e6) + " to unlock Rockets.",
  },

  data: {
    resetGain: 0,
    nextAt: "Infinity",
    effExp: 0,
    effMult: 1,
    maxVelMult: 1,
    accMult: 1,
  },

  values: {
    resetGain: () =>
      Decimal.div(player.distance, 1e6)
        .root(5)
        .times(Decimal.gte(player.distance, 1e6) ? 1.5 : 1)
        .floor(),

    nextAt: () =>
      Decimal.add(rockets.value.data.resetGain, 1)
        .div(Decimal.gte(rockets.value.data.resetGain, 1) ? 1.5 : 1)
        .pow(5)
        .times(1e6),

    effExp: () => Decimal.add(player.rockets, 1).log10(),
    effMult: () => Decimal.div(player.rockets, 2).plus(1),
    maxVelMult: () =>
      Decimal.add(basics.value.data.preRocketMaxVelocity, 1)
        .log10()
        .plus(1)
        .pow(rockets.value.data.effExp)
        .times(rockets.value.data.effMult),
    accMult: () =>
      Decimal.add(basics.value.data.preRocketAccel, 1)
        .log10()
        .plus(1)
        .pow(rockets.value.data.effExp)
        .times(rockets.value.data.effMult),
  },

  receptors: {
    tick: (_) => {
      reloadData(rockets.value, "resetGain");
      reloadData(rockets.value, "nextAt");
    },

    reset: (id) => {
      if (id >= 3) {
        player.rockets = 0;
      }
    },
  },

  actions: {
    rocketUp: () => {
      const gain = rockets.value.values.resetGain();

      if (Decimal.lt(gain, 1)) return;

      player.rockets = Decimal.add(player.rockets, gain);

      signal("reset", 2);
    },
  },
});

export const rockets = ref(features.value.rockets);
