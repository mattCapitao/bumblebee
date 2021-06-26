import Game from "./game.js";
import Hive from "./hive.js";
import Bee from "./bee.js";
const Level = {
  current: 1,
  pollenToHoney: 0.005,

  levels: [{}, {}, {}],

  init: () => {
    Level.seconds = 0;
    Bee.init();
    Hive.init();
    $(".level").html(Level.current);
    $("#start").html("Start Level " + Level.current);

    switch (Level.current) {
      case 2:
        Level.birdSpeedMultiplier += 0.25;
        Level.birdGenThreshold -= 2;
        Level.honeyGoal = 10;
        break;

      case 3:
        Level.birdSpeedMultiplier += 0.25;
        Level.birdGenThreshold -= 2;
        Level.honeyGoal = 20;
        break;

      default:
        Level.birdGenThreshold = 990;
        Level.birdSpeedMultiplier = 1.25;
        Level.honeyGoal = 5;
        break;
    }
  },

  complete: () => {
    Game.stop();
    Game.clear();
		
    let bonusPoints =
      Bee.pollen * (Level.current * 1000) +
      Hive.honey * (Level.current * 5000) +
      Game.lives * (Level.current * 10000);

		Bee.pollen = 0;
		Hive.honey = 0;
    Game.score += bonusPoints;

    $(".completed_level").html(Level.current);
    $(".bonus_points").html(bonusPoints);
    $("#level_complete").show("slow");

    Level.current++;

    if (Level.current > Level.levels.length) {
      Game.complete();
    } else {
      Level.init();
    }
  },
};

export default Level;
