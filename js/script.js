/**
Cigarette Flick
Lucien Cusson-Fradet
*/

"use strict";

let canvas = {
    obj: undefined,
    backgroundColor: "#FFF3E5",
    w: undefined,
    h: window.innerHeight
}

let physics;
let cigarettes = [];

let sounds = []

let state = "pressTheScreen";

/**
Description of preload
*/
function preload() {
    sounds[0] = loadSound('assets/sounds/tear_001.mp3');
    sounds[1] = loadSound('assets/sounds/tear_002.mp3');
    sounds[2] = loadSound('assets/sounds/tear_004.mp3');

    canvas.w = canvas.h / (20/9);
}


/**
Description of setup
*/
function setup() {
    canvas.obj = createCanvas(canvas.w, canvas.h);
    background(canvas.backgroundColor);
    pixelDensity(1);
    physics = new Physics();
    physics.runWorld();
    physics.setGravity(0);

    cigarettes[0] = new Cigarette({x: canvas.w/2 + random(-canvas.w/20, canvas.w/20), y: canvas.h/2 + random(-canvas.h/2, canvas.h/2), angle: random(-TWO_PI, TWO_PI)});
}


/**
Description of draw()
*/
function draw() {
    switch(state) {

        case "pressTheScreen":
        background(canvas.backgroundColor);
        push();
        textSize(50);
        fill("#5B2303")
        textAlign(CENTER, CENTER);
        text("Touch the Screen", canvas.w/2, canvas.h/2);
        pop();

        Matter.Events.on(physics.mConstraint, "mousedown", () => {
            state = "cigarette";
        })
        break;

        case "cigarette":
        background(canvas.backgroundColor);
        if (cigarettes[0] != undefined) {
            cigarettes[0].display();
            cigarettes[0].mouseCollisions();
        }
        //physics.displayMouseConstraint();
        break;
    }
    

    
}
