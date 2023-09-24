import { player } from "@/main";
import { addFeature } from "@/util/feature";
import { formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal, { DecimalSource } from "break_eternity.js";

import type { Feature } from "@/util/feature";
import { timeReversal } from "../timeReversal/timeReversal";
import { Automated, auto } from "../auto/auto";
import { hasLEMil } from "../collapse/collapse";

interface RocketFuelData {
  cost: Decimal;
  target: DecimalSource;
  extra: Decimal;
  power: Decimal;
  effectiveAmt: Decimal;
  eff1: Decimal;
  eff2: Decimal;
  eff3: Decimal;
  eff4: Decimal;
  eff5: Decimal;
}

export const rocketFuel: Feature<RocketFuelData, { fuelUp: () => void }> =
  addFeature("rocketFuel", 4, {
    unl: {
      reached: computed(() => Decimal.gte(player.rockets, 10)),
      desc: computed(
        () => `Reach ${formatWhole(10)} Rockets to unlock Rocket Fuel.`
      ),
    },

    data: {
      cost: computed(() =>
        Decimal.pow(1.6, Decimal.pow(player.rocketFuel, 1.5)).times(25).floor()
      ),
      target: computed(() => {
        const amt = Decimal.mul(
          player.rockets,
          auto.data[Automated.RocketFuel].power.value
        );
        if (Decimal.lt(amt, 25)) return 0;
        return Decimal.div(amt, 25).max(1).log(1.6).root(1.5).plus(1).floor();
      }),
      extra: computed(() => {
        let extra = Decimal.dZero;

        if (player.timeReversal.upgrades.includes(15))
          extra = extra.plus(timeReversal.data[15].value.effect ?? 0);

        if (player.auto[Automated.RocketFuel].mastered) extra = extra.plus(1);

        return extra;
      }),
      power: computed(() => {
        let p = Decimal.dOne;

        if (hasLEMil(34)) p = p.plus(0.2);

        return p;
      }),
      effectiveAmt: computed(() => {
        return rocketFuel.data.extra.value
          .plus(player.rocketFuel)
          .times(rocketFuel.data.power.value);
      }),
      eff1: computed(() =>
        Decimal.lt(rocketFuel.data.effectiveAmt.value, 1)
          ? Decimal.dOne
          : Decimal.pow(
              10,
              Decimal.sqrt(rocketFuel.data.effectiveAmt.value)
                .times(0.75)
                .plus(0.25)
            )
              .div(20)
              .plus(1)
      ),
      eff2: computed(() =>
        Decimal.lt(rocketFuel.data.effectiveAmt.value, 2)
          ? Decimal.dOne
          : Decimal.pow(
              Math.sqrt(2),
              Decimal.sub(rocketFuel.data.effectiveAmt.value, 1).pow(0.75)
            )
      ),
      eff3: computed(() =>
        Decimal.lt(rocketFuel.data.effectiveAmt.value, 3)
          ? Decimal.dOne
          : Decimal.pow(
              Math.pow(2, 0.25),
              Decimal.sub(rocketFuel.data.effectiveAmt.value, 2).pow(0.7)
            )
      ),
      eff4: computed(() =>
        Decimal.sub(rocketFuel.data.effectiveAmt.value, 2).max(1).root(9)
      ),
      eff5: computed(() =>
        Decimal.pow(
          1.5,
          Decimal.sub(rocketFuel.data.effectiveAmt.value, 5).max(0).cbrt()
        )
      ),
    },

    receptors: {
      reset: (id) => {
        if (id >= 3) {
          player.rocketFuel = 0;
        }
      },
    },

    actions: {
      fuelUp: () => {
        if (Decimal.lt(player.rockets, rocketFuel.data.cost.value)) return;

        player.rockets = Decimal.sub(
          player.rockets,
          rocketFuel.data.cost.value
        );
        player.rocketFuel = Decimal.add(player.rocketFuel, 1);
      },
    },
  });
