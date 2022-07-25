import Game from "./game.js";
import Level from "./level.js";
import Hive from "./hive.js";
import Bee from "./bee.js";

let //Bee
  { l, t, mv } = Bee.movement,
  //Cloud
  newCloud = 0,
  cloudCount = 0,
  maxClouds = 5,
  cloudSpeed = 0,
  cloudSpeedMin = 1,
  cloudSpeedMax = 3,
  cloudHeight = 0,
  cloudType = 0,
  cloudClass = "",
  lastCloudClass = "",
  //Bird
  newBird = 0,
  birdSpeed = 0,
  birdSpeedMin = 3,
  birdSpeedMax = 5,
  birdHeight = 0,
  birdType = 0,
  birdClass = "",
  //Flower
  flowerCount = 0,
  maxFlowers = 20,
  minFlowers = 1,
  flowerOddsModifier = 0,
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

window.setInterval(function () {
  if (Game.running) {
    if (Game.reset) {
      Game.init();
    }

    $("#hive").each(function () {
      Bee.inHive = false;
      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 10) >
          $("#avatar").offset().top
      ) {
        Bee.inHive = true;
        let convertQuantity = 1 / Level.pollenToHoney;
        if (Bee.pollen / convertQuantity >= 1) {
          Hive.convertPollen(convertQuantity);
        }
      } else {
        Bee.inHive = false;
      }
      if (Hive.honey >= Level.honeyGoal) {
        Level.complete();
      }
    });

    if (Level.seconds < 3 && Level.fresh) {
      flowerOddsModifier = 50;
    }
    if (Level.seconds >= 3 && Level.fresh) {
      Level.fresh = false;
      flowerOddsModifier -= 50;
    }
    //console.log("Rain Effect = ", Game.rainEffect);
    if (Game.rainEffect && Level.seconds > 5 && flowerOddsModifier < 42) {
      flowerOddsModifier += 42;
    }
    console.log("Flower modifier", flowerOddsModifier);

    if (
      (flowerCount <= maxFlowers &&
        rng(1, 1000) > newFlowerThreshold - flowerOddsModifier) ||
      flowerCount < minFlowers
    ) {
      flowerType = Math.trunc(rng(1, 4001) / 1000 + 1);
      flowerX = rng(1, 34);
      flowerY = rng(1, 94);
      flowerDiff = lastFlowerY - flowerY;
      if (flowerDiff > -40 && flowerDiff < 0) {
        flowerY -= 50;
      }
      if (flowerDiff > 0 && flowerDiff < 40) {
        flowerY += 50;
      }
      lastFlowerY = flowerY;
      flowerExpire = flowerType * 9;
      if (Game.raineffect) {
        flowerExpire /= 2;
      }
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
          "vh;left:" +
          flowerY +
          'vw;"></div>'
      )
        .appendTo(game)
        .slideToggle(3000);
      flowerCount++;
    }

    $(".flower").each(function (element) {
      currentTimeSeconds = new Date().getTime() / 1000;

      if ($(this).attr("data-expire") <= currentTimeSeconds) {
        $(this).slideToggle("slow", function () {
          $(this).remove();
          flowerCount--;
        });
      }

      if (
        $(this).offset().left <
          $("#avatar").offset().left + $("#avatar").width() &&
        $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
        $(this).offset().top <
          $("#avatar").offset().top + $("#avatar").height() &&
        $(this).offset().top + ($(this).height() - 40) >
          $("#avatar").offset().top &&
        currentTimeSeconds < $(this).attr("data-expire")
      ) {
        ///console.log(currentTimeSeconds, $(this).attr("data-expire"));

        currentFlowerPollen = $(this).attr("data-pollen") * 1;

        (pollenTop = $(this).offset().top - 20),
          (pollenLeft = $(this).offset().left + 20);
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
          flowerCount--;
        });
      }
    });

    newCloud = rng(1, 1000);

    if (
      (newCloud > Level.cloudGenThreshold && cloudCount <= maxClouds) ||
      cloudCount < 1
    ) {
      cloudSpeed = rng(cloudSpeedMin, cloudSpeedMax);
      cloudHeight = rng(1, 30);
      cloudType = rng(1, 16);

      cloudClass = "c1";
      if (cloudType > 4) {
        cloudClass = "c2";
      }
      if (cloudType > 8) {
        cloudClass = "c3";
      }
      if (cloudType > 12) {
        cloudClass = "c4";
      }

      if (
        cloudType + Level.current > 16 ||
        (Level.seconds > 60 && Level.hasRained === false)
      ) {
        cloudClass = "rain";
        cloudHeight = cloudHeight > 14 ? cloudHeight : 15;
        //cloudHeight = 15;
        cloudSpeed = 5;
        Game.rainEffect = true;
        Level.hasRained = true;
        Game.rainSound = new Audio("./src/audio/rain.mp3");
        Game.rainSound.play();
      }

      //console.log("cloudClass: ", cloudClass);
      //console.log("lastCloudClass: ", lastCloudClass);
      if (/*cloudCount <= maxClouds && */ cloudClass !== lastCloudClass) {
        let size = "";
        if (cloudClass !== "rain") {
          let cloudScale = 1 + rng(1, 9) / 10;
          let height = 20 * cloudScale;
          let width = 30 * cloudScale;
          size = "width:" + width + "vh;height:" + height + "vh;";
        }

        cloudCount++;

        //console.log("cloudCount", cloudCount);
        let raineffectCycles = "";
        if (cloudClass === "rain") {
          raineffectCycles = ' data-rec="300" ';
        }

        $("#game").append(
          '<div class="cloud ' +
            cloudClass +
            '" style="top:' +
            cloudHeight +
            "%;" +
            size +
            '" data-speed="' +
            cloudSpeed +
            '"' +
            raineffectCycles +
            "></div>"
        );
        lastCloudClass = cloudClass;
      }
    }

    $(".cloud").each(function () {
      let rec = $(this).attr("data-rec");
      if (rec > 0) {
        rec--;
        $(this).attr("data-rec", rec);
        if (rec < 1) {
          Game.rainEffect = false;
          if (flowerOddsModifier > 0) {
            flowerOddsModifier -= 42;
          }
        }
      }

      if (
        // check for qualification and chance to add lighning
        $(this).hasClass("rain") &&
        !$(this).hasClass("lightning") &&
        !$(this).hasClass("hadLightning") &&
        Game.lightningEffect === false &&
        Level.lightningTreshold > 0
      ) {
        let lightningStrike = rng(1, 1000);
        let bolster = lightningBolster($(this).offset().left);

        if (lightningStrike + bolster > Level.lightningTreshold) {
          Game.lightningEffect = true;
          let setLec = rng(50, 150);
          $(this).addClass("lightning");
          $(this).attr("data-lec", setLec);
          $(this).append('<img src="src/img/lightning2.gif" />');
        }
      }

      //console.log("Lightning", Game.lightningEffect);

      if ($(this).hasClass("lightning")) {
        let lec = $(this).attr("data-lec");

        if (lec > 0) {
          lec--;
          $(this).attr("data-lec", lec);
          if (lec < 1) {
            Game.lightningEffect = false;
            $(this).html("");
            $(this).removeClass("lightning");
            $(this).addClass("hadLightning");
          }

          if (
            $(this).offset().left <
              $("#avatar").offset().left + $("#avatar").width() &&
            $(this).offset().left + ($(this).width() - $(this).width() / 5) >
              $("#avatar").offset().left &&
            $(this).offset().top < $("#avatar").offset().top &&
            // this should include + $("#avatar").height() but i have removed for now since cloud animation top is slightly higher than visual element
            $(this).hasClass("lightning") &&
            Bee.inHive === false
          ) {
            Bee.die();
          }
        }
      }

      $(this).animate(
        {
          left: "+=" + $(this).attr("data-speed"),
          top: "+=0",
        },
        1
      );

      if (Game.fadeRainSound == true) {
        Game.rainSound.volume -= 0.05;
        if (Game.rainSound.volume <= 0) {
          Game.rainSound.pause();
          Game.rainSound = null;
          Game.fadeRainSound = false;
        }
      }

      if ($(this).offset().left > $("#game").width()) {
        if ($(this).attr("data-lec") > 0) {
          Game.lightningEffect = false;
        }
        if (Game.rainSound !== null) {
          Game.fadeRainSound = true;
        }

        $(this).remove();
        cloudCount--;
        //console.log("cloudCount", cloudCount);
      }
    });

    newBird = rng(1, 1000);

    if (newBird > Level.birdGenThreshold) {
      birdSpeed = rng(birdSpeedMin, birdSpeedMax) * Level.birdSpeedMultiplier;
      birdHeight = rng(Level.birdTopOffset.min, Level.birdTopOffset.max);
      birdType = rng(1, 20);

      birdClass = "b1";

      if (birdType + Level.current > 21) {
        birdClass = "b2";
        birdSpeed *= 1.5;
      }

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
      let topPath = "+=0";
      if (Level.current >= 4) {
        if ($(this).hasClass("dive") && $(this).attr("data-diveframes") > 0) {
          let frames = $(this).attr("data-diveframes");
          frames--;
          $(this).attr("data-diveframes", frames);

          if (frames < 1) {
            $(this).removeClass("dive");
          }
          topPath = "+=" + $(this).attr("data-speed");
        } else if (
          $(this).hasClass("climb") &&
          $(this).attr("data-climbframes") > 0
        ) {
          let frames = $(this).attr("data-climbframes");
          frames--;
          $(this).attr("data-climbframes", frames);
          if (frames < 1) {
            $(this).removeClass("climb");
          }
          topPath = "-=" + $(this).attr("data-speed");
        } else {
          let flightPathCeiling = 800;
          let flightPath = rng(1, flightPathCeiling);
          if (flightPath <= Level.current) {
            topPath = "-=" + $(this).attr("data-speed");
            $(this).addClass("climb");
            $(this).attr("data-climbframes", Level.current * 2);
          }
          if (flightPath >= flightPathCeiling - Level.current) {
            topPath = "+=" + $(this).attr("data-speed");
            $(this).addClass("dive");
            $(this).attr("data-diveframes", Level.current * 2);
          }
        }
      }

      $(this).animate(
        {
          left: "+=" + $(this).attr("data-speed"),
          top: topPath,
        },
        1
      );

      if ($(this).offset().left > $("#game").width() * Level.birdRange) {
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
          $("#avatar").offset().top &&
        Bee.inHive === false
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
    Level.seconds += 0.04;
  } else {
    if (!Game.paused) {
      $("#start").slideDown(2000);
    }
  }
}, 40);

function rng(min, max) {
  let random_number = Math.random() * (max - min) + min;
  return Math.floor(random_number);
}

function lightningBolster(cloudOffset) {
  let unit = $("#game").width() / 10;
  let units = cloudOffset / unit;
  let bolster = units * Level.lightningBolsterFactor;
  if (units > Level.lightningPeakBolster) {
    let reduction =
      Level.lightningBolsterFactor * (units - Level.lightningPeakBolster);
    bolster -= reduction;
  }
  return bolster;
}

$(document).on("click", ".btn_run_game", function () {
  Game.start();
  $(this).hide();
  $(".banner").hide("fast");
});

$(document).on("click", ".pause", function () {
  if (Game.running && !Game.paused) {
    Game.pause();
    $(this).removeClass("pause");
    $(this).addClass("play");
  }
});

$(document).on("click", ".play", function () {
  if (!Game.running && Game.paused) {
    Game.start();
    $(this).removeClass("play");
    $(this).addClass("pause");
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
