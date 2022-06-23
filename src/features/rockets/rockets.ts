import { player } from "@/main";
import { addFeature, Feature, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import { SOFTCAPS, createSoftcap } from "@/util/softcapped";
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

export const ROCKET_EFF_EXP_SOFTCAP = createSoftcap({
  softcap: SOFTCAPS.CBRT,
  start: 3.5,
});

export const rockets: Feature<RocketData, { rocketUp: () => void }> =
  addFeature("rockets", {
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

      effExp: computed(() => {
        const exp = Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .plus(1)
          .log10()
          .times(rocketFuel.data.eff4.value);
        return ROCKET_EFF_EXP_SOFTCAP.apply(exp);
      }),
      effMult: computed(() => {
        let eff = Decimal.mul(player.rockets, rocketFuel.data.eff1.value)
          .div(2)
          .plus(1);
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
