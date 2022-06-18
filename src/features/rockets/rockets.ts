import { player } from "@/main";
import { addFeature, Feature, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal, { DecimalSource } from "break_eternity.js";
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

export const rockets: Feature<RocketData, RocketActions> = addFeature<
  RocketData,
  RocketActions
>("rockets", 1, {
  unl: {
    reached: computed(() => Decimal.gte(player.distance, 1e6)),
    desc: computed(
      () => "Reach " + formatDistance(1e6) + " to unlock Rockets."
    ),
  },

  data: {
    resetGain: computed(() =>
      Decimal.div(player.distance, 1e6)
        .root(5)
        .times(Decimal.gte(player.distance, 1e6) ? 1.5 : 1)
        .floor()
    ),

    nextAt: computed(() =>
      Decimal.add(rockets.data.resetGain.value, 1)
        .div(Decimal.gte(rockets.data.resetGain.value, 1) ? 1.5 : 1)
        .pow(5)
        .times(1e6)
    ),

    effExp: computed(() => Decimal.add(player.rockets, 1).log10()),
    effMult: computed(() => {
      let eff = Decimal.div(player.rockets, 2).plus(1);
      if (eff.gte(10)) eff = eff.times(10).sqrt();
      return eff;
    }),

    maxVelMult: computed(() =>
      Decimal.add(basics.data.preRocketMaxVelocity.value, 1)
        .log10()
        .plus(1)
        .pow(rockets.data.effExp.value)
        .times(rockets.data.effMult.value)
    ),

    accMult: computed(() =>
      Decimal.add(basics.data.preRocketAccel.value, 1)
        .log10()
        .plus(1)
        .pow(rockets.data.effExp.value)
        .times(rockets.data.effMult.value)
    ),
  },

  receptors: {
    reset: (id) => {
      if (id >= 3) {
        player.rockets = 0;
      }
    },
  },

  actions: {
    rocketUp: () => {
      const gain = rockets.data.resetGain.value;

      if (Decimal.lt(gain, 1)) return;

      player.rockets = Decimal.add(player.rockets, gain);

      signal("reset", 2);
    },
  },
});
