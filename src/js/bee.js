const Bee = {
  elem: "#avatar",
  sprite: "bee_left.png",
  spriteLast: null,
  setSprite: (l, t, mv) => {
    Bee.sprite = "bee_left.png"
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
