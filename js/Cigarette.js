class Cigarette {
    constructor({x, y, angle}) {
        this.brokenFlag = false;

        this.pos = {
            x: x,
            y: y
        }

        this.segments = {
            segmentBodies: [],
            segmentColors: []
        };
        this.segmentColors = {
            orange: "#F2913D",
            white: "#e5d6c8"
        }

        this.NUM_SEGMENTS = 20;
        this.length = canvas.w - canvas.w/3;
        this.thickness = this.length/10;
        this.segmentWidth = this.length/this.NUM_SEGMENTS;

        for (let i = 0; i < this.NUM_SEGMENTS; i++) {
            let segParams = {
                x: this.pos.x - this.length/2 + (i * this.segmentWidth),
                y: this.pos.y,
                w: this.segmentWidth,
                h: this.thickness,
                options: {}
            }
            let segmentBody = Bodies.rectangle(segParams.x, segParams.y, segParams.w, segParams.h, segParams.options)
            this.segments.segmentBodies.push(segmentBody)
            if (i < this.NUM_SEGMENTS / 3) {
                this.segments.segmentColors.push(this.segmentColors.orange)
            }
            else {
                this.segments.segmentColors.push(this.segmentColors.white)
            }
        }
        // physics.addToWorld(this.segments);
        this.compoundBody = physics.createCompoundBody(this.segments.segmentBodies);
        //Body.setMass(this.body, 0.3);
        Body.setAngle(this.compoundBody, angle);
        Composite.add(physics.world, this.compoundBody); //adds the body to matter.js world
    }

    display() {
        if (!this.brokenFlag) {
            for (let i = 1; i < this.segments.segmentBodies.length; i++) { 
                let pos = this.segments.segmentBodies[i].position;
                let angle = this.segments.segmentBodies[i].angle;
                let color = this.segments.segmentColors[i - 1]; //segmentBodies[0] is the compoundBody
                push();
                translate(pos.x, pos.y);
                rotate(angle);
                rectMode(CENTER);
                strokeWeight(0);
                fill(color);
                rect(0, 0, this.segmentWidth*2, this.thickness)
                pop();
            }
        }
        else {
            for (let i = 1; i < this.segments.first.segmentBodies.length; i++) { 
                let pos = this.segments.first.segmentBodies[i].position;
                let angle = this.segments.first.segmentBodies[i].angle;
                let color = this.segments.first.segmentColors[i - 1]; //segmentBodies[0] is the compoundBody
                push();
                translate(pos.x, pos.y);
                rotate(angle);
                rectMode(CENTER);
                strokeWeight(0);
                fill(color);
                rect(0, 0, this.segmentWidth*2, this.thickness)
                pop();
            }

            for (let i = 1; i < this.segments.second.segmentBodies.length; i++) { 
                let pos = this.segments.second.segmentBodies[i].position;
                let angle = this.segments.second.segmentBodies[i].angle;
                let color = this.segments.second.segmentColors[i - 1]; //segmentBodies[0] is the compoundBody
                push();
                translate(pos.x, pos.y);
                rotate(angle);
                rectMode(CENTER);
                strokeWeight(0);
                fill(color);
                rect(0, 0, this.segmentWidth*2, this.thickness)
                pop();
            }
        }
        
    }

    mouseCollisions() {
        //check if mouse is colliding
        if (!this.brokenFlag) {
            for (let i = 1; i < this.segments.segmentBodies.length; i++) { 
                let d = dist(
                    this.segments.segmentBodies[i].position.x, 
                    this.segments.segmentBodies[i].position.y,
                    physics.mConstraint.mouse.position.x,
                    physics.mConstraint.mouse.position.y
                    )
                if (d < this.segmentWidth*2) {
                    this.cutCigarette(i);
                    break;
                }
            }
        }
    }

    cutCigarette(index) {
        this.brokenFlag = true;
        physics.setGravity(1);
        this.playSound();

        setTimeout(() => {physics.disableMouseConstraintTemp(3000)}, 200);

        //create two new compound bodies
        let first = {
            segmentBodies: [],
            segmentColors: []
        },
        second = {
            segmentBodies: [],
            segmentColors: []
        }

        for (let i = 1; i < this.segments.segmentBodies.length; i++) {
            let seg = this.segments.segmentBodies[i]; 
            let segParams = {
                x: seg.position.x,
                y: seg.position.y,
                w: this.segmentWidth,
                h: this.thickness,
                options: {}
            }
            let segmentBody = Bodies.rectangle(segParams.x, segParams.y, segParams.w, segParams.h, segParams.options);
            segmentBody.collisionFilter.category = 0b10;

            //push in the arrays
            if (i < index) {
                first.segmentBodies.push(segmentBody);
                first.segmentColors.push(this.segments.segmentColors[i - 1]);
            }
            else {
                second.segmentBodies.push(segmentBody);
                second.segmentColors.push(this.segments.segmentColors[i - 1]);
            }
        }

        let compoundBodyFirst = physics.createCompoundBody(first.segmentBodies);
        let compoundBodySecond = physics.createCompoundBody(second.segmentBodies);

        //remove previous
        Composite.remove(physics.world, this.compoundBody);

        this.segments = {
            first: first,
            second: second
        }
        this.compoundBody = {
            first: compoundBodyFirst,
            second: compoundBodySecond
        }

        Composite.add(physics.world, this.compoundBody.first);
        Composite.add(physics.world, this.compoundBody.second);

        Body.applyForce( this.compoundBody.first, {x: this.compoundBody.first.position.x + this.segments.first.segmentBodies.length * this.segmentWidth, y: this.compoundBody.first.position.y}, {x: -0.1, y: -0.01});
        Body.applyForce( this.compoundBody.second, {x: this.compoundBody.second.position.x - this.segments.second.segmentBodies.length * this.segmentWidth, y: this.compoundBody.second.position.y}, {x: 0.1, y: -0.01});
        
        setTimeout(() => {
            physics.setGravity(0);
            Composite.remove(physics.world, this.compoundBody.first);
            Composite.remove(physics.world, this.compoundBody.second);
            cigarettes[0] = new Cigarette({x: canvas.w/2 + random(-canvas.w/20, canvas.w/20), y: canvas.h/2 + random(-canvas.h/2, canvas.h/2), angle: random(-TWO_PI, TWO_PI)});
        }, 6000);
    }

    playSound() {
        shuffle(sounds, true);
        sounds[0].play();
    }
    
}