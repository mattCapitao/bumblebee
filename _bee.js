

let keyMap = { 37: false, 38: false, 39: false, 40: false } ;


let score = 0, startingLives=5, lives=startingLives, resetScore=false, resetLives=false, currentTimeSeconds=0, sprite = 'bee.png',
    l = "+=0", t = "+=0",  mv = 6, spriteLast = null, avatarPollen=0, currentAvatarPollen = 0, currentFlowerPollen = 0,
    newBird = 0, birdSpeed = 0, birdSpeedMin = 3, birdSpeedMax = 5, birdHeight = 0, birdType = 0, birdClass="";

let startnewBirdTreshold = 990, newBirdTreshold=startnewBirdTreshold, startBirdSpeedMultiplier = 1.25, birdSpeedMultiplier=startBirdSpeedMultiplier,
    newFlower=0, flowerType=0, flowerX=0, flowerY=0, newFlowerThreshold=991, flowerExpire=0, flowerPollen=0, lastFlowerY=0, pollenMultiplier=2, flowerDiff = 0, pollenTop = 0,
    hiveHoney=0, honeyGoal=5, pollenToHoney= .005, gameRunning = false, resetGame=false, newLevel=false, level=1, pollenBonus=0, honeyBonus=0, livesBonus=0;

$("#score").html(score);
$("#lives").html(startingLives);
$("#pollen").html(avatarPollen);
$("#honey").html(hiveHoney);
$(".level").html(level);

$(document).on("click", ".btn_run_game", function(){
    gameRunning = true;
    $(this).hide();
    $(".banner").hide("fast");
});

$(document).on('keydown', function (e) {
    if (e.which in keyMap) {
        keyMap[e.which] = true;
        if (keyMap[38]) { t = "-=" + mv; }
        if (keyMap[40]) { t = "+=" + mv; }
        if (keyMap[37]) { l = "-=" + mv; }
        if (keyMap[39]) { l = "+=" + mv; }
    }
}).keyup(function (e) {
    if (e.which in keyMap) {
        keyMap[e.which] = false;
        if (e.which == 37 || e.which == 39) { l = "+=0"; }
        if (e.which == 38 || e.which == 40) { t = "+=0"; }
    }
});

function setBeeSprite(l, t) {
    if (spriteLast != null) { sprite = spriteLast; }
    if (l == '+=' + mv && t == '-=' + mv) { sprite = "bee_up_right.png" }
    if (l == '+=' + mv && t == '+=0') { sprite = "bee_right.png" }
    if (l == '+=' + mv && t == '+=' + mv) {sprite = "bee_down_right.png"}
    if (l == '-=' + mv && t == '-=' + mv) {sprite = "bee_up_left.png"}
    if (l == '-=' + mv && t == '+=0') {sprite = "bee_left.png"}
    if (l == '-=' + mv && t == '+=' + mv) {sprite = "bee_down_left.png"}
    spriteLast = sprite;
    $("#avatar").css('background-image', 'url(' + sprite + ')');
}

function rng(min, max) {
    let random_number = Math.random() * (max - min) + min;
    return Math.floor(random_number);
}

function birdFood(){
    console.log("Bird Food!");
    gameRunning = false;
    $(".bird").each(function () {$(this).remove();});
    sprite = "bee_left.png";
    $("#avatar").css('background-image', 'url(' + sprite + ')').animate(
        {
        left : '830px',
        top :  '240px'
    });
    lives --;
    if(lives < 1){gameOver();}
}

function gameInit(){
    gameRunning=false;
    resetGame = true;
}

function gameOver(){
    $("#game_over").show("slow");
    $("#start").html("New Game");
    gameInit();
}

function levelComplete(){
    gameRunning=false;
    newLevel=true;
    console.log("level complete called");
    pollenBonus = avatarPollen*(level*1000);
    honeyBonus = hiveHoney*(level*5000);
    livesBonus = lives * (level*10000);
    score += (pollenBonus + honeyBonus + livesBonus);
    $("#level_complete").show("slow");
    level++;
    $(".level").html(level);
    $("#start").html('Start Level '+level);
    pollenBonus=0; honeyBonus=0; livesBonus=0; 
    $(".bird").each(function () {
        $(this).remove();
    });
}

function missionComplete(){
    score += (lives * 100000);
    $(".final_score").html(score);
    $("#mission_complete").show("slow");
    $("#start").html("New Game");
    gameInit();
}

window.setInterval(function () {
    if (gameRunning) {

        if(resetGame){
            score=0; level=1;
            $(".level").html(level);
            lives=startingLives; avatarPollen=0; hiveHoney=0;
            birdSpeedMultiplier= startBirdSpeedMultiplier;
            newBirdTreshold = startnewBirdTreshold;
            resetGame=false;
        }

        if(newLevel){
            
            avatarPollen=0; hiveHoney=0;
            birdSpeedMultiplier= startBirdSpeedMultiplier;
            newBirdTreshold = startnewBirdTreshold;

            switch(level){
                case 2:
                    birdSpeedMultiplier+=.25;
                    newBirdTreshold-=2;
                    honeyGoal=35;
                break;

                default:
                    missionComplete();
                break;
            }
            

            newLevel=false;
        }

        $("#hive").each(function(element){
            if ( 
                $(this).offset().left < $("#avatar").offset().left + $("#avatar").width() &&
                $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
                $(this).offset().top < ($("#avatar").offset().top + $("#avatar").height()) &&
                ($(this).offset().top + ($(this).height()-40)) > $("#avatar").offset().top 

            ){  
               avatarPollen = ( $("#avatar").attr('data-pollen')*1 )

               if(avatarPollen >= 1000 ){
                    avatarPollen = avatarPollen - 1000;
                    $("#avatar").attr('data-pollen',avatarPollen);
                    hiveHoney=($("#hive").attr('data-honey')*1) + (1000*pollenToHoney);
                    $("#hive").attr('data-honey', hiveHoney);
                    score += 2500;  
               }
            }
            if(hiveHoney >= honeyGoal){levelComplete();}
        });

        newFlower = rng(1,1000);
        
        if( newFlower > newFlowerThreshold){
            flowerType = Math.trunc((rng(1,4001)/1000)+1);
            console.log(flowerType);
            flowerX= rng(1,149);
            flowerY= rng(20,750);
            flowerDiff = lastFlowerY - flowerY;
            if(flowerDiff > (-40) && flowerDiff < 0 ){flowerY -= 50;}
            if(flowerDiff > 0 && flowerDiff < 40 ){flowerY += 50;}
            //console.log("l: " + lastFlowerY + " d: " + flowerDiff + " y: " + flowerY)
            lastFlowerY = flowerY;
            flowerExpire=flowerType*9;
            flowerPollen= (6-flowerType)*pollenMultiplier;
            let expireTime = new Date().getTime() / 1000;
            expireTime = (expireTime + flowerExpire);
            $('<div data-expire="'+expireTime+'" data-pollen="'+flowerPollen+'" class="flower f' + flowerType + '" style="display:none;bottom:'+ flowerX +'px;left:'+ flowerY + 'px;"></div>' ).appendTo(game).slideToggle(3000);
        }

        $(".flower").each(function (element) {
            currentTimeSeconds =  new Date().getTime() / 1000;

            if($(this).attr("data-expire") <=  currentTimeSeconds){
                $(this).slideToggle("slow", function(){
                    $(this).remove();
                });
            }

            if ( 
                $(this).offset().left < $("#avatar").offset().left + $("#avatar").width() &&
                ($(this).offset().left + $(this).width()) > $("#avatar").offset().left &&
                $(this).offset().top < ($("#avatar").offset().top + $("#avatar").height()) &&
                ($(this).offset().top + ($(this).height()-40)) > $("#avatar").offset().top 

            ){  
                currentAvatarPollen = $("#avatar").attr('data-pollen')*1;
                currentFlowerPollen = $(this).attr('data-pollen')*1;

                pollenTop = $(this).offset().top - 20, pollenLeft = $(this).offset().left + 20;
                $('<div class="pollen" style="top:'+pollenTop+'px; left:'+pollenLeft+'px;">'+currentFlowerPollen+'</div>').appendTo(game).animate({
                        opacity: 0,
                        top: "-=75",
                        left: "+=50"

                }, 50, function(){
                    $(this).remove()
                });

                //console.log(currentAvatarPollen + "+" + currentFlowerPollen + "=" + (currentAvatarPollen + currentFlowerPollen));
                avatarPollen = currentAvatarPollen + currentFlowerPollen;
                $("#avatar").attr('data-pollen', avatarPollen);
                points= ($(this).attr('data-pollen') *10);
                console.log("Pollen Collcted +" + points + " Points!");
                score = score + Math.trunc(points);
               $(this).fadeOut(2000, function(){
                    $(this).remove();
                });
            }
        });

        newBird = rng(1, 1000);
        if (newBird > newBirdTreshold) {
            birdSpeed = (rng(birdSpeedMin, birdSpeedMax) * birdSpeedMultiplier);
            //birdSpeed = 1;

            birdHeight = rng(20, 70);

            let birdType = rng(1,6);
            if(birdType < 5 ){birdClass = "b1";
            }else{birdClass = "b2"; birdSpeed *= 1.5; }

            $(this).addClass(birdClass);
            $("#game").append('<div class="bird '+birdClass+'" style="top:' + birdHeight + '%;" data-speed="' + birdSpeed + '"></div>');
            birdSpeed = 0;
            //newBirdTreshold++;
        }

        $(".bird").each(function () {

            $(this).animate({
                left: '+=' + $(this).attr('data-speed'),
                top: '+=0'
            }, 1);

            if ($(this).offset().left > 1200) {
                $(this).remove();
                points=(($(this).attr('data-speed') * birdSpeedMultiplier)*100);
                console.log("Bird Dodged +" + points + " Points!");
                score = score + Math.trunc(points);
                birdSpeedMultiplier = birdSpeedMultiplier * 1.005;
                newBirdTreshold = newBirdTreshold -.04;
            }

            if ( $(this).offset().left < $("#avatar").offset().left + $("#avatar").width() &&
                 ($(this).offset().left + ($(this).width()-10)) > $("#avatar").offset().left &&
                 ($(this).offset().left + ($(this).width()-60)) < $("#avatar").offset().left &&
                 $(this).offset().top < ($("#avatar").offset().top + $("#avatar").height()) &&
                 ($(this).offset().top + ($(this).height()-40)) > $("#avatar").offset().top &&
                 ($(this).offset().top + ($(this).height()-90)) < $("#avatar").offset().top 
            ){
                birdFood();
            }
        });

        $("#score").html(score);
        $("#lives").html(lives);
        $("#pollen").html(avatarPollen);
        $("#honey").html(hiveHoney);

        setBeeSprite(l, t);
        $("#avatar").animate({
            left: l,
            top: t
        }, 2);
    } else { // game not running
           $("#start").slideDown(2000) ;
        ;
    }
}, 40);
