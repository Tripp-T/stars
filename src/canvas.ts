export function setupCanvas(element: HTMLCanvasElement) {
    const ctx = element.getContext('2d');
    if (!ctx) { 
        console.error("failed to get canvas context");
        return;
    };
    
    // make canvas full screen on init and resize
    element.width = window.innerWidth;
    element.height = window.innerHeight;
    window.onresize = () => {
        element.width = window.innerWidth;
        element.height = window.innerHeight;
    };

    new StarManager(element, ctx);
}

class StarManager {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    maxDistance = 575;
    maxStars = 7000;
    stars: Star[] = [];

    tickInterval = 25; // ms, increase for slower ticks
    lastTick = 0;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;

        const animate = (now: number) => {
            if (!this.lastTick || now - this.lastTick >= this.tickInterval) {
                this.tick();
                this.lastTick = now;
            }
            this.render();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    tick() {
        var newStars: Star[] = [];
        for (const star of this.stars) {
            star.location.x += star.velocity.x;
            star.location.y += star.velocity.y;
            star.location.z += star.velocity.z;
            // skip reusing stars that are too far or out of view
            if (star.location.z < 1 && star.location.z > -this.maxDistance) {
                newStars.push(star);
            }
        }
        this.stars = newStars;

        // add new stars if under max
        if (this.stars.length < this.maxStars) {
            // add a random number of stars up to the max
            for (let i = 0; i < Math.random() * (this.maxStars - this.stars.length); i++) {
                const size = Math.random() * 3 + 2;
                const location = new Coordinates(
                    (Math.random() - 0.5) * this.canvas.width,
                    (Math.random() - 0.5) * this.canvas.height,
                    0
                );
                this.stars.push(new Star(size, location));
            }
        }
    }

    render() {
        // clear canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw stars
        for (const star of this.stars) {
            this.ctx.fillStyle = star.color;
            const screenX = (star.location.x / star.location.z) * this.canvas.width + (this.canvas.width / 2);
            const screenY = (star.location.y / star.location.z) * this.canvas.height + (this.canvas.height / 2);
            const screenSize = (star.size / -star.location.z) * 100;

            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, screenSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

class Coordinates {
    x: number;
    y: number
    z: number;
    
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Star {
    size: number;

    location: Coordinates
    velocity: Coordinates;

    color: string;

    constructor(size: number, location: Coordinates) {
        this.size = size;

        this.location = location;
        // randomized velocity away from the viewer
        this.velocity = new Coordinates(0, 0, -Math.random() * 5 - 0.5);

        // randomized color
        this.color = `rgb(${Math.floor(Math.random() * 156) + 100}, ${Math.floor(Math.random() * 156) + 100}, ${Math.floor(Math.random() * 156) + 100})`;
    }
}
