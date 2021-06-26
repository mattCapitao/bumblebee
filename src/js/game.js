import Level from "./level.js";

const Game = {
    
    running: false,
    reset: false,
    startingLives: 5,
    score: 0,
    keyMap : { 37: false, 38: false, 39: false, 40: false },




    init : () => {
        Level.current = 1;
        $(".level").html(Level.current);
        Game.lives = Game.startingLives; 
        Game.score = 0;
        Game.reset = false;
    },

    start : () => {
        Game.running = true;
    },

    stop : () => {
        
        Game.running = false;
    },

    end : () => {
        Game.stop();
        Game.reset = true;
    },

    complete : () => {

    },

    over : () => {
        $("#game_over").show("slow");
        $("#start").html("New Game");
        Game.end();
    }
        
 

};

export default Game;