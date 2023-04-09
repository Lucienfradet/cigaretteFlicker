/**
Cigarette Flick
Lucien Cusson-Fradet
*/

"use strict";

let canvas = {
    obj: undefined,
    backgroundColor: "#FFF3E5",
    w: window.innerWidth,
    h: window.innerHeight
}

let physics;
let cigarettes = [];

let sounds = []

/**
Description of preload
*/
function preload() {
    sounds[0] = loadSound('assets/sounds/tear_001.mp3');
    sounds[1] = loadSound('assets/sounds/tear_002.mp3');
    sounds[2] = loadSound('assets/sounds/tear_003.mp3');
    sounds[3] = loadSound('assets/sounds/tear_004.mp3');
}


/**
Description of setup
*/
function setup() {
    canvas.obj = createCanvas(canvas.w, canvas.h);
    background(canvas.backgroundColor);
    physics = new Physics();
    physics.runWorld();
    physics.setGravity(0);

    cigarettes[0] = new Cigarette({x: canvas.w/2, y: canvas.h/2});
}


/**
Description of draw()
*/
function draw() {
    background(canvas.backgroundColor);

    cigarettes[0].display();
    cigarettes[0].mouseCollisions();

    physics.displayMouseConstraint();
}
