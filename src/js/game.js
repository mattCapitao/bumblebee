import Bee from "./bee.js";
import Hive from "./hive.js";
import Level from "./level.js";

const Game = {
  running: false,
  reset: false,
  startingLives: 5,
  score: 0,
  keyMap: { 37: false, 38: false, 39: false, 40: false },

  init: () => {
    Level.current = 1;
    Game.lives = Game.startingLives;
    Game.score = 0;
    Game.reset = false;
    $("#score").html(Game.score);
    $("#lives").html(Game.startingLives);
    Level.init();
    Hive.init();
    Bee.init();
  },

  start: () => {
    Game.running = true;
  },

  stop: () => {
    Game.running = false;
  },

  end: () => {
    Game.stop();
    Game.clear();
    Game.reset = true;
  },

  clear: () => {
    $(".bird").each(function () {
      $(this).remove();
    });

    $(".flower").each(function () {
      $(this).remove();
    });
  },

  complete: () => {
    Game.score += Game.lives * 100000;
    $(".final_score").html(Game.score);
    $("#mission_complete").show("slow");
    $("#start").html("New Game");
    Game.end();
  },

  over: () => {
    $(".final_score").html(Game.score);
    $("#game_over").show("slow");
    $("#start").html("New Game");
    Game.end();
  },
};

export default Game;
