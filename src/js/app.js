import Game from "./game.js";
import Bee from "./bee.js";
import Level from "./level.js";
import Hive from "./hive.js";

let //Bee
  { l, t, mv } = Bee.movement,

  //Bird
  newBird = 0,
  birdSpeed = 0,
  birdSpeedMin = 3,
  birdSpeedMax = 5,
  birdHeight = 0,
  birdType = 0,
  birdClass = "",

  //Flower
  currentTimeSeconds = 0,
  currentFlowerPollen = 0,
  newFlower = 0,
  flowerType = 0,
  flowerX = 0,
  flowerY = 0,
  newFlowerThreshold = 991,
  flowerExpire = 0,
  flowerPollen = 0,
  lastFlowerY = 0,
  pollenMultiplier = 2,
  flowerDiff = 0,
  //Pollen
  pollenTop = 0,
  pollenLeft = 0;

Game.init();

$(document).on("click", ".btn_run_game", function () {
  Game.start();
  $(this).hide();
  $(".banner").hide("fast");
});

$(document)
  .on("keydown", function (e) {
    if (e.which in Game.keyMap) {
      Game.keyMap[e.which] = true;
      if (Game.keyMap[38]) {
        t = "-=" + mv;
      }
      if (Game.keyMap[40]) {
        t = "+=" + mv;
      }
      if (Game.keyMap[37]) {
        l = "-=" + mv;
      }
      if (Game.keyMap[39]) {
        l = "+=" + mv;
      }
    }
    Bee.setSprite(l, t, mv);
  })
  .keyup(function (e) {
    if (e.which in Game.keyMap) {
      Game.keyMap[e.which] = false;
      if (e.which == 37 || e.which == 39) {
        l = "+=0";
      }
      if (e.which == 38 || e.which == 40) {
        t = "+=0";
      }
    }
  });

function rng(min, max) {
  let random_number = Math.random() * (max - min) + min;
  return Math.floor(random_number);
}

function birdFood() {
  console.log("Bird Food!");
  Game.stop();
	Game.clear();
  Bee.init();
  $("#avatar")
    .css("background-image", "url(src/img/" + Bee.sprite + ")")
    .animate({
      left: "830px",
      top: "240px",
    });
  Game.lives--;
  $("#lives").html(Game.lives);
  if (Game.lives < 1) {
    Game.over();
  }
}

window.setInterval(function () {
  if (Game.running) {
    if (Game.reset) {
      Game.init();
    }

    //if (Level.new) {Level.init();}

    $("#hive").each(function (element) {
      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 40) >
          $("#avatar").offset().top
      ) {

        if (Bee.pollen >= 1000) {
          Bee.pollen -= 1000;
          Hive.honey =
            $("#hive").attr("data-honey") * 1 + 1000 * Level.pollenToHoney;
          $("#hive").attr("data-honey", Hive.honey);
          Game.score += 2500;
        }
      }
      if (Hive.honey >= Level.honeyGoal) {
        Level.complete();
      }
    });

    newFlower = rng(1, 1000);

    if (newFlower > newFlowerThreshold) {
      flowerType = Math.trunc(rng(1, 4001) / 1000 + 1);
      //console.log(flowerType);
      flowerX = rng(1, 149);
      flowerY = rng(20, 750);
      flowerDiff = lastFlowerY - flowerY;
      if (flowerDiff > -40 && flowerDiff < 0) {
        flowerY -= 50;
      }
      if (flowerDiff > 0 && flowerDiff < 40) {
        flowerY += 50;
      }
      //console.log("l: " + lastFlowerY + " d: " + flowerDiff + " y: " + flowerY)
      lastFlowerY = flowerY;
      flowerExpire = flowerType * 9;
      flowerPollen = (6 - flowerType) * pollenMultiplier;
      let expireTime = new Date().getTime() / 1000;
      expireTime = expireTime + flowerExpire;
      $(
        '<div data-expire="' +
          expireTime +
          '" data-pollen="' +
          flowerPollen +
          '" class="flower f' +
          flowerType +
          '" style="display:none;bottom:' +
          flowerX +
          "px;left:" +
          flowerY +
          'px;"></div>'
      )
        .appendTo(game)
        .slideToggle(3000);
    }

    $(".flower").each(function (element) {
      currentTimeSeconds = new Date().getTime() / 1000;

      if ($(this).attr("data-expire") <= currentTimeSeconds) {
        $(this).slideToggle("slow", function () {
          $(this).remove();
        });
      }

      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 40) >
          $("#avatar").offset().top
      ) {
        currentFlowerPollen = $(this).attr("data-pollen") * 1;

        (pollenTop = $(this).offset().top - 20),
          (pollenLeft = $(this).offset().left - 480);
        $(
          '<div class="pollen" style="top:' +
            pollenTop +
            "px; left:" +
            pollenLeft +
            'px;">' +
            currentFlowerPollen +
            "</div>"
        )
          .appendTo(game)
          .animate(
            {
              opacity: 0,
              top: "-=75",
              left: "+=50",
            },
            50,
            function () {
              $(this).remove();
            }
          );

        //console.log(Bee.currentPollen + "+" + currentFlowerPollen + "=" + (Bee.currentPollen + currentFlowerPollen));
        Bee.pollen += currentFlowerPollen;
        let points = $(this).attr("data-pollen") * 10;
        //console.log("Pollen Collcted +" + points + " Points!");
        Game.score += Math.trunc(points);
        $(this).fadeOut(2000, function () {
          $(this).remove();
        });
      }
    });

    newBird = rng(1, 1000);
    //console.log(newBird, Level.birdGenThreshold);
    if (newBird > Level.birdGenThreshold) {
      birdSpeed = rng(birdSpeedMin, birdSpeedMax) * Level.birdSpeedMultiplier;
      //birdSpeed = 1;

      birdHeight = rng(20, 70);

      birdType = rng(1, 6);

      if (birdType < 5) {
        birdClass = "b1";
      } else {
        birdClass = "b2";
        birdSpeed *= 1.5;
      }

      $(this).addClass(birdClass);
      $("#game").append(
        '<div class="bird ' +
          birdClass +
          '" style="top:' +
          birdHeight +
          '%;" data-speed="' +
          birdSpeed +
          '"></div>'
      );
      birdSpeed = 0;
    }

    $(".bird").each(function () {
      $(this).animate(
        {
          left: "+=" + $(this).attr("data-speed"),
          top: "+=0",
        },
        1
      );

      if ($(this).offset().left > 1200) {
        $(this).remove();
        let points =
          $(this).attr("data-speed") * Level.birdSpeedMultiplier * 100;
        //console.log("Bird Dodged +" + points + " Points!");
        Game.score += Math.trunc(points);
        Level.birdSpeedMultiplier *= 1.005;
        Level.birdGenThreshold -= 0.04;
      }

      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + ($(this).width() - 10) >
          $("#avatar").offset().left &&
        $(this).offset().left + ($(this).width() - 60) <
          $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 40) >
          $("#avatar").offset().top &&
        $(this).offset().top + ($(this).height() - 90) <
          $("#avatar").offset().top
      ) {
        birdFood();
      }
    });

    $("#score").html(Game.score);
    $("#lives").html(Game.lives);
    $("#pollen").html(Bee.pollen);
    $("#honey").html(Hive.honey);

    $("#avatar").css("background-image", "url(src/img/" + Bee.sprite + ")");

    $("#avatar").animate(
      {
        left: l,
        top: t,
      },
      2
    );
  } else {
    // game not running
    $("#start").slideDown(2000);
  }
}, 40);
