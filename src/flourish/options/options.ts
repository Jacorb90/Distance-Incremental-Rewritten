import { player, metaSave } from "@/main";
import { saveGame, startingSave } from "@/util/saveload";
import { Notify } from "quasar";
import { ref } from "vue";

import type { StyleValue } from "vue";

interface OptionData {
  text: string | (() => string);
  action: () => void;
  style?: StyleValue;
  classes?: Record<string, boolean>;
}

export const loadModalOpen = ref(false);

// eslint-disable-next-line
export const OPTION_DATA: {SAVING: OptionData[], OTHER: OptionData[]} = {
  SAVING: [
    {
      text: "Save",
      action: () => {
        saveGame();
      },
    },
    {
      text: "Load",
      action: () => (loadModalOpen.value = true),
    },
    {
      text: "Import",
      action: () => {
        const data = prompt("Paste your save data here: ");

        if (data !== null) {
          try {
            metaSave.saves[metaSave.currentSave] = JSON.parse(atob(data));
            saveGame(false);

            location.reload();
          } catch (e) {
            Notify.create({
              message: "Import Error!",
              position: "top-right",
              type: "danger",
              timeout: 5000,
              badgeStyle: "opacity: 0;",
            });
            console.error(e);
          }
        }
      },
    },
    {
      text: "Export",
      action: () => {
        const data = btoa(JSON.stringify(metaSave.saves[metaSave.currentSave]));

        navigator.clipboard.writeText(data).catch((e) => {
          Notify.create({
            message: "Export Error!",
            position: "top-right",
            type: "danger",
            timeout: 5000,
            badgeStyle: "opacity: 0;",
          });
          console.error(e);
        });

        Notify.create({
          message: "Export successful!",
          position: "top-right",
          type: "info",
          timeout: 1500,
          badgeStyle: "opacity: 0;",
        });
      },
    },
    {
      text: "HARD RESET",
      action: () => {
        if (!confirm("Are you sure you want to reset your current save?"))
          return;

        metaSave.saves[metaSave.currentSave] = startingSave(
          metaSave.currentSave,
          metaSave.saves[metaSave.currentSave].modes
        );

        saveGame(false);
        location.reload();
      },
      classes: {
        neg: true,
      },
    },
    {
      text: () => "Autosave: " + (player.opts.autoSave ? "ON" : "OFF"),
      action: () => {
        player.opts.autoSave = !player.opts.autoSave;
      },
    },
  ],

  OTHER: [
    {
      text: () => "Offline Time: " + (player.opts.offlineTime ? "ON" : "OFF"),
      action: () => {
        player.opts.offlineTime = !player.opts.offlineTime;
      },
    },
    {
      text: () =>
        "Notation: " +
        ["Mixed Scientific", "Standard", "Scientific"][
          player.opts.notation ?? 0
        ],
      action: () => {
        player.opts.notation = (player.opts.notation + 1) % 3;
      },
    },
    {
      text: () =>
        "Distance Format: " +
        ["Normal", "Just Meters", "Reduced"][player.opts.distanceFormat ?? 0],
      action: () => {
        player.opts.distanceFormat = (player.opts.distanceFormat + 1) % 3;
      },
    },
    {
      text: () => "Newsticker: " + (player.opts.newsticker ? "ON" : "OFF"),
      action: () => {
        player.opts.newsticker = !player.opts.newsticker;
      },
    },
  ],
};
