import { player } from "@/main";
import { DISTANCES, parseFunc } from "@/util/format";
import Decimal from "break_eternity.js";
import { ref } from "vue";

import type { Ref } from "vue";

interface NewsData {
  text: string | (() => string);
  condition?: () => boolean;
}

const NEWSTICKER_DATA: NewsData[] = [
  // No Conditions
  { text: "Welcome to the truest of travels" },
  { text: "We of the news ticker committee say hi." },
  { text: "Accelerate from here to the end of the universe." },
  { text: "Maximum Velocity is the source of the multiverse." },
  { text: "Cancer notation has been kept away for now..." },
  { text: "Try to win without achievements" },
  {
    text: "You have probably ran over at least 1 snail so far on your journey",
  },
  { text: "There is no True Infinity here" },
  { text: "Is this rewritten?" },
  { text: "Pentation is for the weak" },
  { text: "If you can read this, you are officially Canadian." },
  { text: "5 light hours until the update" },
  { text: "Never gonna give you down, never gonna let you up - Ack Ristley" },
  {
    text: "We report that there is a very fast man Naruto-running running towards Area 51, but 2 and a half years too late",
  },
  {
    text: "This game was inspired by the original Distance Incremental, which was inspired by Antimatter Dimensions",
  },
  {
    text: "Is offline progression still weak? Only way to find out is to go touch some grass!",
  },
  { text: "Distance Incremental 2: Electric Boogaloo" },
  {
    text: "People say that this is unbalanced, but really it's just that all the other games are too balanced.",
  },
  {
    text: 'Man, some of the old news tickers haven\'t aged well. For example: "The mysterious virus of [HYPERLINK BLOCKED] has been dealt with (at least for now)"',
  },
  {
    text: "Starting again from scratch with a slight increase in progression speed really hits the spot, huh",
  },
  {
    text: "The high gods are looking down on you (or up, maybe you're further than I thought)",
  },
  { text: "Egg is the next mechanic" },
  {
    text: () =>
      "Here's a random number from 1 to 10: " +
      Math.floor(Math.random() * 10 + 1),
  },
  { text: "This game lags, but your vision is so bad that it looks normal." },
  {
    text: "Please don't disable the news, it's the only way for me to be heard...",
  },
  { text: "Now that we use break_eternity, I am become death." },
  {
    text: "Have you ever been stuck in a timewall for minutes on end, and are questioning your existence because of it? Well, you might be entitled to compensation.",
  },
  {
    text: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little.             What, you thought I was gonna paste the whole thing? I'm not that evil.",
  },
  {
    text: () =>
      "Here's a personalized message just for you: " +
      Math.floor(Math.random() * 1e10 + 1e9).toString(2),
  },
  { text: "Bad testing" },
  { text: "I'm lazy, so why don't you go rickroll yourself this time..." },
  {
    text: "This news ticker is completely common. Not any more rare or special than any other. What a waste of a read...",
  },
  { text: '"Ya like jazz?" - BBB' },
  {
    text: "Remember to export often! If you happen to destroy your computer (for ANY reason), the game's saves will be deleted too!",
  },
  { text: "Gotta wonder what you're using to travel this far" },
  {
    text: "BREAKING NEWS: Florida Man goes out for a jog: becomes High God of the Omniverse",
  },
  { text: "This feature is definitely not a ripoff of anything else..." },
  { text: "This is not the 69th news ticker" },
  { text: "If you can see this, go back to playing the game" },
  {
    text: "There is a news ticker entry out there that has apparently tried to rick roll people, but it is in another game.",
  },
  { text: "What if you wanted to go to heaven, but god said (softcapped)" },
  { text: "Softcapped: the game" },
  { text: '"Gaming" - Danny DeVito' },
  {
    text: "Imagine doxxing yourself in a news ticker message? Couldn't be me.",
  },
  { text: '"But that\'s just a theory, a ____ theory!" - Matmat Patpat' },
  { text: '"Nyesn\'t" - A meme man' },
  {
    text: "The most recent feature of Distance Incremental Rewritten is definitely not a ripoff of the original game.",
  },
  {
    text: '"I should make a mod of Antimatter Dimension that releases Reality before Hevipelle does..."            This news ticker aged like fine milk.',
  },
  { text: "Kirb is still faster than you" },
  {
    text: 'Maybe I should\'ve named this "Distance Incremental: Ultra Deluxe"',
  },
  { text: "Imagine putting hotkeys in your game" },
  { text: "News man go brrrrrrrrrrrrrrrrrrr" },
  { text: "Am I getting paid for this?" },
  {
    text: "Are you the real Slim Shady? If so, get out of your chair as soon as you can.",
  },
  { text: "I'd say these memes are old, but I don't know any new ones." },
  {
    text: "Due to a recent influx of news stories, we have decided to make the news ticker (softcapped)",
  },
  {
    text: '"I wonder if my lore will ever catch up to the most recent update?" - CRG',
  },
  { text: "This message has been (softcapped) so you can't re-" },
  {
    text: "Maybe try getting some distance in real life? It's just a suggestion...",
  },
  {
    text: "This news ticker is both lying to you and telling the absolute truth at the same time.",
  },
  { text: "What does uni even stand for? University?" },
  {
    text: "(softcapped) is the new (softcapped), because new ideas are (softcapped).",
  },
  {
    text: "It seems I'm too late to implement egg as the next mechanic, Void did it first.",
  },
  {
    text: "We are out of news, so we'll just start repeating old news and hope nobody notices... oop-",
  },
  {
    text: "I wonder when the Low God update will be released.",
  },
  {
    text: "In case you were wondering: No, Distance Incremental is not made in Rust.",
  },
  {
    text: "Only someone who hasn't ascended to a higher plane would think the original Distance Incremental isn't worth playing now that a rewrite exists.",
  },

  // Distance-based Conditions
  {
    text: "You've travelled more than me today",
    condition: () => Decimal.gte(player.distance, 500),
  },
  {
    text: "The world is your pebble",
    condition: () => Decimal.gte(player.distance, DISTANCES.ly),
  },
  {
    text: "I guess multiple universes exist then",
    condition: () => Decimal.gte(player.distance, DISTANCES.uni),
  },

  // Chance-based Conditions
  {
    text: "This is a rare news ticker! You win a negligible amount of minor satisfaction!",
    condition: () => Math.random() < 0.25,
  },
  {
    text: "This is a super rare news ticker! You win a decent amount of satisfaction...",
    condition: () => Math.random() < 0.1,
  },
  {
    text: "This is an ultra rare news ticker! You win an obscene amount of happiness!",
    condition: () => Math.random() < 0.0025,
  },
  {
    text: "All your smarts are no chance for dumb luck",
    condition: () => Math.random() < 1e-9,
  },
  {
    text: "Your luck skills have broken the universe",
    condition: () => Math.random() < 1e-15,
  },
  {
    text: "Your luck skills have broken the multiverse, and everything within it",
    condition: () => Math.random() < 1e-30,
  },
  {
    text: "If you went through 1 news ticker every planck time, and waited until the end of the universe's lifespan, you still should not see this",
    condition: () => Math.random() < 1e-80,
  },
  {
    text: "Your luck is so insane that there's no way you didn't cheat, you cheater",
    condition: () => false,
  },

  // Achievement-based Conditions
  {
    text: "You're a superstar in this world of false light",
    condition: () => player.achs.length >= 5,
  },
  {
    text: "Wow, you are slightly dedicated",
    condition: () => player.achs.length >= 10,
  },
  {
    text: "Out to the world beyond the rocket",
    condition: () => player.achs.length >= 5,
  },
  {
    text: "Aw, you're doing so well! Feel free to take a break whenever you need one!",
    condition: () => player.achs.length >= 20,
  },

  // Special Conditions
  {
    text: "Weren't we already using those?",
    condition: () => Decimal.gt(player.rockets, 0),
  },
  {
    text: "Rocket Fuel is the best mechanic of the game, but only in the original.",
    condition: () => Decimal.gt(player.rocketFuel, 0),
  },
];

const newsTimeout: Ref<number> = ref(-1);
export const currentNews = ref("");
export const newsMovement = ref(0);

function getNews(): string {
  const availableNews = NEWSTICKER_DATA.filter(
    (data) => data?.condition?.() ?? true
  );
  const news = availableNews[Math.floor(Math.random() * availableNews.length)];
  return parseFunc(news.text);
}

export function doNews() {
  clearTimeout(newsTimeout.value);

  currentNews.value = getNews();
  newsMovement.value = -currentNews.value.length;
}

export function checkNextNews() {
  const parentLength = document.getElementById("newsticker")?.clientWidth ?? 0;

  if (newsMovement.value > parentLength / 8) doNews();
}
