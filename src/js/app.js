import Game from "./game.js";
import Level from "./level.js";
import Hive from "./hive.js";
import Bee from "./bee.js";


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

function rng(min, max) {
  let random_number = Math.random() * (max - min) + min;
  return Math.floor(random_number);
}

window.setInterval(function () {
  if (Game.running) {
    if (Game.reset) {
      Game.init();
    }

    $("#hive").each(function () {
      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 40) >
          $("#avatar").offset().top
      ) {
				let convertQuantity = (1 / Level.pollenToHoney);
        if (Bee.pollen/convertQuantity >= 1) {
          Hive.convertPollen(convertQuantity);
        }
      }
      if (Hive.honey >= Level.honeyGoal) {
        Level.complete();
      }
    });

    if (rng(1, 1000) > newFlowerThreshold) {
      flowerType = Math.trunc(rng(1, 4001) / 1000 + 1);
      flowerX = rng(1, 149);
      flowerY = rng(20, 750);
      flowerDiff = lastFlowerY - flowerY;
      if (flowerDiff > -40 && flowerDiff < 0) {
        flowerY -= 50;
      }
      if (flowerDiff > 0 && flowerDiff < 40) {
        flowerY += 50;
      }
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

        Bee.pollen += currentFlowerPollen;
        let points = $(this).attr("data-pollen") * 10;
        Game.score += Math.trunc(points);
        $(this).fadeOut(2000, function () {
          $(this).remove();
        });
      }
    });

    newBird = rng(1, 1000);

    if (newBird > Level.birdGenThreshold) {
      birdSpeed = rng(birdSpeedMin, birdSpeedMax) * Level.birdSpeedMultiplier;
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
        Bee.die();
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
		if(!Game.paused){
			$("#start").slideDown(2000);
		}
    
  }
}, 40);

$(document).on("click", ".btn_run_game", function () {
  Game.start();
  $(this).hide();
  $(".banner").hide("fast");
});

$(document).on("click", ".pause", function(){
	if(Game.running && !Game.paused){
		Game.pause();
		$(this).removeClass("pause");
		$(this).addClass("play")
	}
	
});

$(document).on("click", ".play", function(){
	if(!Game.running && Game.paused){
		Game.start();
		$(this).removeClass("play");
		$(this).addClass("pause")
	}

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
