let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Runner = Matter.Runner,
    Constraint = Matter.Constraint,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

class Physics {
    constructor() {
        this.engine = Engine.create({
            gravity: {
                y: 1
            } 
        });
        this.world = this.engine.world; //world in the engine for further use
        this.runner = Runner.create(); //not in use

        //Create MouseConstraint
        canvas.mouse = Mouse.create(canvas.obj.elt); //canvas element in the P5.js canvas wrapper

        canvas.mouse.pixelRatio = pixelDensity(); //Adapt to the pixel density of the screen in use

        this.mouseContraintFlag = true;
        this.mouseContraintOptions = {
            collisionFilter: {mask: 0b1},
            mouse: canvas.mouse,
            constraint: {
                stiffness: 0.009,
                angularStiffness: 0.2
            }
        }
        this.mConstraint = MouseConstraint.create(this.engine, this.mouseContraintOptions);
        Composite.add(this.world, this.mConstraint);
    }

    runWorld() {
        Runner.run(this.engine);
    }
    
    addToWorld(array) {
        Composite.add(physics.world, array);
    }
    
    createCompoundBody(parts) {
        let compoundBody = Body.create({ parts: parts });
        return compoundBody;
    }

    setGravity(y) {
        this.engine.gravity.y = y;
    }

    displayMouseConstraint() {
        if (this.mouseContraintFlag) {
            push();
            let pos = {
                x: this.mConstraint.mouse.position.x,
                y: this.mConstraint.mouse.position.y
            }
            fill(255,255,255,150);
            noStroke();
            ellipseMode(CENTER);
            ellipse(pos.x, pos.y, 10);
            pop();
        
            //display line
            if (this.mConstraint.body) {
                let pos = this.mConstraint.body.position;
                let offset = this.mConstraint.constraint.pointB;
                let mouse = this.mConstraint.mouse.position;
                push();
                stroke(255, 230);
                line(pos.x + offset.x, pos.y + offset.y, mouse.x, mouse.y);
                pop();
            }
        }

        Matter.Events.on(this.mConstraint, "startdrag", () => {console.log("mouseDrag");});
        
      }

      disableMouseConstraintTemp(time) {
        this.mouseContraintFlag = false;
        Composite.remove(this.world, this.mConstraint);
        setTimeout(this.reactivateMouseContraint, time);
      }

      reactivateMouseContraint() {
        Composite.add(physics.world, physics.mConstraint);
        this.mouseContraintFlag = true;
      }
}
