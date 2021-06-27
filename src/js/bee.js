import Game from "./game.js";


const Bee = {
  elem: "#avatar",
  
  movement: {
    l: "+=0",
    t: "+=0",
    mv: 6,
  },

  init: () => {
    Bee.dead = false;
    Bee.sprite = "bee_left.png";
    Bee.spriteLast = null;
    $("#avatar")
    .css("background-image", "url(src/img/" + Bee.sprite + ")")
    .animate({
        left: "830px",
        top: "240px",
        rotation:0
    });
    
    Bee.pollen = 0;
    $("#pollen").html(Bee.pollen);
  },

  die: () =>{
    Bee.dead = true;
    $("#avatar")
    .css("background-image", "url(src/img/bee_left.png)")
    .animate({
        top: "340px",
        rotation: 180
    }, {duration:2500});
    Game.lives--;
    $("#lives").html(Game.lives);
    if (Game.lives < 1) {
        Game.over();
    }else{
        Game.stop();
	    Game.clear();
    }
  },

  setSprite: (l, t, mv) => {
    Bee.sprite = "bee_left.png";
    if (Bee.spriteLast != null) {
      Bee.sprite = Bee.spriteLast;
    }
    if (l == "+=" + mv && t == "-=" + mv) {
      Bee.sprite = "bee_up_right.png";
    }
    if (l == "+=" + mv && t == "+=0") {
      Bee.sprite = "bee_right.png";
    }
    if (l == "+=" + mv && t == "+=" + mv) {
      Bee.sprite = "bee_down_right.png";
    }
    if (l == "-=" + mv && t == "-=" + mv) {
      Bee.sprite = "bee_up_left.png";
    }
    if (l == "-=" + mv && t == "+=0") {
      Bee.sprite = "bee_left.png";
    }
    if (l == "-=" + mv && t == "+=" + mv) {
      Bee.sprite = "bee_down_left.png";
    }
    Bee.spriteLast = Bee.sprite;
    //console.log("Bee.sprite = ", Bee.sprite);
    return Bee.sprite;
  },
};

export default Bee;
