
import Level from "./level.js";
import Hive from "./hive.js";
import Bee from "./bee.js";

const Game = {
  running: false,
  paused: false,
  keyMap: { 37: false, 38: false, 39: false, 40: false },

  init: () => {
    Level.current = 1;
    Game.lives = 5;
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
    Game.paused = false;
    if(Bee.dead){Bee.init();}
  },

  pause: () => {
      Game.paused = true;
      Game.stop();
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
