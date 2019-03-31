
var keyMap = { 37: false, 38: false, 39: false, 40: false }
var l = "+=0", t = "+=0", mv = 3;
var sprite = 'bee.png', spriteLast = null;
var newBird = 0, birdSpeed = 0, birdHeight = 0;
var gameRunning = false;

$(document).on('keydown', function (e) {
    gameRunning = true;
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

    if (l == '+=' + mv && t == '+=' + mv) {
        sprite = "bee_down_right.png"
    }

    if (l == '-=' + mv && t == '-=' + mv) {
        sprite = "bee_up_left.png"
    }
    if (l == '-=' + mv && t == '+=0') {
        sprite = "bee_left.png"
    }
    if (l == '-=' + mv && t == '+=' + mv) {
        sprite = "bee_down_left.png"
    }

    spriteLast = sprite;
    $("#avatar").css('background-image', 'url(' + sprite + ')');

}

function rng(min, max) {
    let random_number = Math.random() * (max - min) + min;
    return Math.floor(random_number);
}

window.setInterval(function () {
    if (gameRunning) {

        newBird = rng(1, 1000);

        if (newBird > 990) {
            birdSpeed = rng(1, 6);
            birdHeight = rng(20, 70);
            $("#game").append('<div class="bird" style="top:' + birdHeight + '%;" data-speed="' + birdSpeed + '"></div>');
            birdSpeed = 0;
        }

        $(".bird").each(function (element) {

            $(this).animate({
                left: '+=' + $(this).attr('data-speed'),
                top: '+=0'
            }, 1);

            if ($(this).offset().left > 1200) {
                $(this).remove();
            }
        });

        setBeeSprite(l, t);

        $("#avatar").animate({
            left: l,
            top: t
        }, 1);
    }
}, 20);

