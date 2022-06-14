import player, { metaSave } from "@/main";
import { saveGame, startingSave } from "@/saveload";
import { ref, StyleValue } from "vue";

interface OptionData {
  text: string | (() => string);
  action: () => void;
  style?: StyleValue;
  classes?: { [key: string]: boolean };
}

export const loadModalOpen = ref(false);

// eslint-disable-next-line
export const OPTION_DATA: {SAVING: OptionData[], OTHER: OptionData[]} = {
  SAVING: [
    {
      text: "Save",
      action: () => {
        saveGame(metaSave.value);
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
            metaSave.value.saves[metaSave.value.currentSave] = JSON.parse(
              atob(data)
            );
            player.value = metaSave.value.saves[metaSave.value.currentSave];

            saveGame(metaSave.value);
          } catch (e) {
            alert(
              "It seems as though your save cannot be loaded! Please check the console for details!"
            );
            console.error(e);
          }
        }
      },
    },
    {
      text: "Export",
      action: () => {
        const data = btoa(
          JSON.stringify(metaSave.value.saves[metaSave.value.currentSave])
        );

        navigator.clipboard.writeText(data).catch((e) => {
          alert(
            "It seems as though your save cannot be exported! Please check the console for details!"
          );
          console.error(e);
        });
      },
    },
    {
      text: "HARD RESET",
      action: () => {
        if (!confirm("Are you sure you want to reset your current save?"))
          return;

        metaSave.value.saves[metaSave.value.currentSave] = startingSave(
          metaSave.value.currentSave,
          metaSave.value.saves[metaSave.value.currentSave].modes
        );

        saveGame(metaSave.value);
        location.reload();
      },
      classes: {
        neg: true,
      },
    },
    {
      text: () => "Autosave: " + (player.value.opts.autoSave ? "ON" : "OFF"),
      action: () => {
        player.value.opts.autoSave = !player.value.opts.autoSave;
      },
    },
  ],

  OTHER: [
    {
      text: () =>
        "Offline Time: " + (player.value.opts.offlineTime ? "ON" : "OFF"),
      action: () => {
        player.value.opts.offlineTime = !player.value.opts.offlineTime;
      },
    },
    {
      text: () =>
        "Notation: " +
        ["Mixed Scientific", "Standard", "Scientific"][
          player.value.opts.notation ?? 0
        ],
      action: () => {
        player.value.opts.notation = (player.value.opts.notation + 1) % 3;
      },
    },
    {
      text: () =>
        "Distance Format: " +
        ["Normal", "Just Meters", "Reduced"][
          player.value.opts.distanceFormat ?? 0
        ],
      action: () => {
        player.value.opts.distanceFormat =
          (player.value.opts.distanceFormat + 1) % 3;
      },
    },
    {
      text: () =>
        "Newsticker: " + (player.value.opts.newsticker ? "ON" : "OFF"),
      action: () => {
        player.value.opts.newsticker = !player.value.opts.newsticker;
      },
    },
  ],
};
