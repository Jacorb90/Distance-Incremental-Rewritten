import { player } from "@/main";
import { addFeature, Feature, signal } from "@/util/feature";
import { formatDistance } from "@/util/format";
import { SOFTCAPS, createSoftcap } from "@/util/softcapped";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";
import { basics } from "../basics/basics";

interface RocketData {
  startingReq: Decimal;
  gainMult: Decimal;
  resetGain: Decimal;
  nextAt: Decimal;
  rfCost: Decimal;
  rfEff1: Decimal;
  rfEff2: Decimal;
  rfEff3: Decimal;
  rfEff4: Decimal;
  effExp: Decimal;
  effMult: Decimal;
  maxVelMult: Decimal;
  accMult: Decimal;
}

interface RocketActions {
  rocketUp: () => void;
  fuelUp: () => void;
}

export const ROCKET_EFF_EXP_SOFTCAP = createSoftcap({
  softcap: SOFTCAPS.CBRT,
  start: 3.5,
});

export const rockets: Feature<RocketData, RocketActions> = addFeature(
  "rockets",
  {
    unl: {
      reached: computed(() => Decimal.gte(player.distance, 1e6)),
      desc: computed(
        () => "Reach " + formatDistance(1e6) + " to unlock Rockets."
      ),
    },

    data: {
      startingReq: computed(() => Decimal.div(1e6, rockets.data.rfEff2.value)),

      gainMult: computed(() => rockets.data.rfEff3.value),

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

      rfCost: computed(() =>
        Decimal.pow(1.6, Decimal.pow(player.rocketFuel, 1.5)).times(25).floor()
      ),
      rfEff1: computed(() => Decimal.div(player.rocketFuel, 4 / 3).plus(1)),
      rfEff2: computed(() => Decimal.max(player.rocketFuel, 1).sqrt()),
      rfEff3: computed(() => Decimal.sub(player.rocketFuel, 1).max(1).cbrt()),
      rfEff4: computed(() =>
        Decimal.sub(player.rocketFuel, 2).max(1).log2().plus(1).root(9)
      ),

      effExp: computed(() => {
        const exp = Decimal.mul(player.rockets, rockets.data.rfEff1.value)
          .plus(1)
          .log10()
          .times(rockets.data.rfEff4.value);
        return ROCKET_EFF_EXP_SOFTCAP.apply(exp);
      }),
      effMult: computed(() => {
        let eff = Decimal.mul(player.rockets, rockets.data.rfEff1.value)
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

      fuelUp: () => {
        if (Decimal.lt(player.rockets, rockets.data.rfCost.value)) return;

        player.rockets = Decimal.sub(player.rockets, rockets.data.rfCost.value);
        player.rocketFuel = Decimal.add(player.rocketFuel, 1);
      },
    },
  }
);
