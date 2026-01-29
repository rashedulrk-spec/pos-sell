// ================================
// BACKGROUND.JS — NETWORK CANVAS (FINAL)
// ================================

/*
  নোট:
  - Full screen animated network background
  - Mouse interaction সহ
*/

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = "-1";

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/*
  নোট: Mouse interaction config
*/
const mouse = {
  x: null,
  y: null,
  radius: 160
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

/*
  নোট: Dot class
*/
class Dot {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = 2.3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,200,255,0.9)";
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= w) this.vx *= -1;
    if (this.y <= 0 || this.y >= h) this.vy *= -1;

    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        this.x += dx / 8;
        this.y += dy / 8;
      }
    }

    this.draw();
  }
}

/*
  নোট: Dots init
*/
const dots = [];
for (let i = 0; i < 110; i++) {
  dots.push(new Dot());
}

/*
  নোট:
  Dot connection lines
*/
function connectDots() {
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180) {
        ctx.strokeStyle = `rgba(0,180,255,${1 - dist / 180})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
}

/*
  নোট: Animation loop
*/
function animate() {
  ctx.clearRect(0, 0, w, h);
  dots.forEach(d => d.update());
  connectDots();
  requestAnimationFrame(animate);
}

animate();
