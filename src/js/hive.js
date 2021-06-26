import Game from "./game.js";
import Level from "./level.js";
import Bee from "./bee.js";

const Hive = {
  elem: "#hive",

  init: () => {
      Hive.honey = 0;
    $("#honey").html(Hive.honey);
  },

  convertPollen: () => {
    Bee.pollen -= 1000;
    Hive.honey += (1000 * Level.pollenToHoney);
    Game.score += 2500; 
  }
};

export default Hive;
