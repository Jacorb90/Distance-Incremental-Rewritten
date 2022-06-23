import { player } from "@/main";
import { addFeature, Feature } from "@/util/feature";
import { formatWhole } from "@/util/format";
import { computed } from "@vue/reactivity";
import Decimal from "break_eternity.js";

interface RocketFuelData {
  cost: Decimal;
  eff1: Decimal;
  eff2: Decimal;
  eff3: Decimal;
  eff4: Decimal;
}

export const rocketFuel: Feature<RocketFuelData, { fuelUp: () => void }> =
  addFeature("rocketFuel", {
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
      eff1: computed(() => Decimal.div(player.rocketFuel, 4 / 3).plus(1)),
      eff2: computed(() => Decimal.max(player.rocketFuel, 1).sqrt()),
      eff3: computed(() => Decimal.sub(player.rocketFuel, 1).max(1).cbrt()),
      eff4: computed(() =>
        Decimal.sub(player.rocketFuel, 2).max(1).log2().plus(1).root(9)
      ),
    },

    receptors: {},

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
