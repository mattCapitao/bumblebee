
var keyMap = { 37: false, 38: false, 39: false, 40: false }
var l = "+=0", t = "+=0", mv = 6;
var sprite = 'bee.png', spriteLast = null;
var newBird = 0, birdSpeed = 0, birdSpeedMin = 3, birdSpeedMax = 5, birdHeight = 0;
var startnewBirdTreshold = 990, newBirdTreshold=startnewBirdTreshold, startBirdSpeedMultiplier = 1.25, birdSpeedMultiplier=startBirdSpeedMultiplier;
var newFlower=0, flowerType=0, flowerX=0, flowerY=0, newFlowerThreshold=985, flowerExpire=0, flowerPollen=0, pollenMultiplier=2;
var score = 0, startingLives=5, lives= startingLives, resetScore= false, resetLives=false, currentTimeSeconds=0;
var avatarPollen=0, hiveHoney=0;
var gameRunning = false, resetGame=false;

$("#score").html(score);
$("#lives").html(startingLives);
$("#pollen").html(avatarPollen);
$("#honey").html(hiveHoney);

$(document).on("click", "#start", function(){
    gameRunning = true;
    $(this).hide();
    $("#mission_complete").hide("fast");
    $("#game_over").hide("fast");
});

$(document).on('keydown', function (e) {
    //gameRunning = true;
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
    $(".bird").each(function (element) {$(this).remove();});
    sprite = "bee_left.png";
    $("#avatar").css('background-image', 'url(' + sprite + ')').animate(
        {
        left : '830px',
        top :  '240px'
    });
    lives --;
    if(lives < 1){gameOver();}
}

function gameOver(){
    
    console.log("Game Over")
    $("#game_over").show("slow");
    resetGame = true;
    $("#start").slideDown(1000);
}

function missionComplete(){
    gameRunning = false;
    console.log("Mission Complete You Win!")
    score = score + (lives * 100000);
    $(".final_score").html(score);
    $("#mission_complete").show("slow");
    resetGame = true;
    $("#start").slideDown(1000);
}

window.setInterval(function () {
    if (gameRunning) {

        if(resetGame){
            score=0;
            lives=startingLives;
            avatarPollen=0;
            hiveHoney=0;
            birdSpeedMultiplier= startBirdSpeedMultiplier;
            newBirdTreshold = startnewBirdTreshold;
            resetGame=false;
        }

        $("#hive").each(function(element){
            if ( 
                $(this).offset().left < $("#avatar").offset().left + $("#avatar").width() &&
                $(this).offset().left + $(this).width() > $("#avatar").offset().left &&
                $(this).offset().top < ($("#avatar").offset().top + $("#avatar").height()) &&
                ($(this).offset().top + ($(this).height()-40)) > $("#avatar").offset().top 

            ){  
               avatarPollen = ($("#avatar").attr('data-pollen')*1)

               if(avatarPollen >= 100 ){
                    avatarPollen = avatarPollen - 100;
                    console.log("Pollen Delivered to the Hive! + 2500 Points")
                    $("#avatar").attr('data-pollen',avatarPollen);
                    hiveHoney=($("#hive").attr('data-honey')*1) + 10
                    $("#hive").attr('data-honey', hiveHoney);
                    score = score + 2500;  
               }
            }
            if(hiveHoney > 99){missionComplete();}
        });

        newFlower = rng(1,1000);
        
        if( newFlower > newFlowerThreshold){
            flowerType = Math.trunc((rng(1,4001)/1000)+1);
            console.log(flowerType);
            flowerX= rng(1,149);
            flowerY= rng(20,750);
            flowerExpire=flowerType*5;
            flowerPollen= (6-flowerType)*pollenMultiplier;
            var expireTime = new Date().getTime() / 1000;
            expireTime = (expireTime + flowerExpire);
            //$("#game").append('<div data-expire="'+expireTime+'" data-pollen="'+flowerPollen+'" class="flower f' + flowerType + '" style="top:'+ flowerX +'px;left:'+ flowerY + 'px;"></div>' );
            $('<div data-expire="'+expireTime+'" data-pollen="'+flowerPollen+'" class="flower f' + flowerType + '" style="display:none;bottom:'+ flowerX +'px;left:'+ flowerY + 'px;"></div>' ).appendTo(game).slideToggle(2000);
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
                let currentAvatarPollen = $("#avatar").attr('data-pollen')*1;
                let currentFlowerPollen = $(this).attr('data-pollen')*1;
                console.log(currentAvatarPollen + "+" + currentFlowerPollen + "=" + (currentAvatarPollen + currentFlowerPollen));
                avatarPollen = currentAvatarPollen + currentFlowerPollen;
                $("#avatar").attr('data-pollen', avatarPollen);
                points= ($(this).attr('data-pollen') *100);
                console.log("Pollen Collcted +" + points + " Points!");
                score = score + Math.trunc(points);
                // Need to implement a check to see if flower has already given pollen before implmenting fade animation becasue it registers the hit multipe times during fadeOut
               // $(this).fadeOut(19, function(){
                    $(this).remove();
                //});
            }
        });

        newBird = rng(1, 1000);

        if (newBird > newBirdTreshold) {
            birdSpeed = (rng(birdSpeedMin, birdSpeedMax) * birdSpeedMultiplier);
            //birdSpeed = 1;
            birdHeight = rng(20, 70);
            $("#game").append('<div class="bird" style="top:' + birdHeight + '%;" data-speed="' + birdSpeed + '"></div>');
            birdSpeed = 0;
            //newBirdTreshold++;
        }

        $(".bird").each(function (element) {

            $(this).animate({
                left: '+=' + $(this).attr('data-speed'),
                top: '+=0'
            }, 1);

            if ($(this).offset().left > 1200) {
                $(this).remove();
                points=(($(this).attr('data-speed') * birdSpeedMultiplier)*10);
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

        //console.log("Bee location" + l + "," + t);

        $("#avatar").animate({
            left: l,
            top: t
        }, 2);
    } else {
        $("#start").show();
    }
}, 40);

