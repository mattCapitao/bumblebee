import Game from "./game.js";
import Levels from "./levels.js";
import Hive from "./hive.js";
import Bee from "./bee.js";

const Level = {
  current: 1,
  pollenToHoney: 0.005,
  max: Object.keys(Levels).length,

  init: () => {
    Level.seconds = 0;
		Level.fresh = true;
		Level.hasRained = false;
		Level.lightningThreshold = 0;
		Level.lightningBolsterFactor = 0,
    Level.lightningPeakBolster = 0,
    Level.birdTopOffset={min:20,max:70},
    Bee.init();
    Bee.movement.mv += .5;
    Hive.init();
		Game.rainEffect = false;
    $(".level").html(Level.current);
    $("#start").html("Start Level " + Level.current);
    $(".flower").each(function (element) {
        $(this).remove();
        flowerCount--;
    });
    Object.assign(Level, Levels["l" + Level.current]);
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

    if (Level.current > Level.max) {
      Game.complete();
    } else {
      Level.init();
    }
  },
};

export default Level;
