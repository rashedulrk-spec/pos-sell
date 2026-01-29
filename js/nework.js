/* =========================
   NETWORK BACKGROUND (FINAL)
   Bigger nodes + longer lines
========================= */

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
const POINTS = 90;          // 🔥 বেশি dots
const MAX_DIST = 180;       // 🔥 বড় line range

for (let i = 0; i < POINTS; i++) {
  points.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  points.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2); // 🔥 বড় dot
    ctx.fillStyle = "rgba(0,200,255,0.9)";
    ctx.fill();
  });

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DIST) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = `rgba(0,180,255,${1 - dist / MAX_DIST})`;
        ctx.lineWidth = 1.1; // 🔥 মোটা লাইন
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
