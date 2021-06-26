const Bee = {
  elem: "#avatar",
  
  
  movement: {
    l: "+=0",
    t: "+=0",
    mv: 6,
  },

  init: () => {
    Bee.sprite = "bee_left.png";
    Bee.spriteLast = null;
    Bee.pollen = 0;
    $("#pollen").html(Bee.pollen);
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
