import { player } from "@/main";
import { addFeature, Feature, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { basics } from "../basics/basics";
import { rocketFuel } from "../rocketFuel/rocketFuel";

interface RocketData {
  startingReq: Decimal;
  gainMult: Decimal;
  resetGain: Decimal;
  nextAt: Decimal;
  effExp: Decimal;
  effMult: Decimal;
  maxVelMult: Decimal;
  accMult: Decimal;
}

export const rockets: Feature<RocketData, { rocketUp: () => void }> =
  addFeature("rockets", 2, {
    unl: {
      reached: computed(() => Decimal.gte(player.distance, 1e6)),
      desc: computed(() => `Reach ${formatDistance(1e6)} to unlock Rockets.`),
    },

    data: {
      startingReq: computed(() => Decimal.div(1e6, rocketFuel.data.eff2.value)),

      gainMult: computed(() => rocketFuel.data.eff3.value),

      resetGain: computed(() =>
        Decimal.div(player.distance, rockets.data.startingReq.value)
          .root(2.5)
          .times(rockets.data.gainMult.value)
          .floor()
      ),

      nextAt: computed(() =>
        Decimal.add(rockets.data.resetGain.value, 1)
          .div(rockets.data.gainMult.value)
          .pow(2.5)
          .times(rockets.data.startingReq.value)
      ),

      effExp: computed(() =>
        Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .plus(1)
          .log10()
          .plus(Decimal.gt(player.rockets, 0) ? 0.2 : 0)
          .sqrt()
          .times(1.5)
          .times(rocketFuel.data.eff4.value)
      ),
      effMult: computed(() =>
        Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .plus(1)
          .sqrt()
          .times(2.5)
          .sub(2)
          .max(1)
      ),

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
