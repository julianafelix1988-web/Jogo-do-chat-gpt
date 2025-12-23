const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================= PLAYER =================
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 4
};

// ================= INPUT (TOUCH) =================
let touchX = player.x;
let touchY = player.y;

canvas.addEventListener("touchmove", e => {
  const touch = e.touches[0];
  touchX = touch.clientX;
  touchY = touch.clientY;
});

// ================= ENEMIES =================
const enemies = [];

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;

  if (side === 0) { x = 0; y = Math.random() * canvas.height; }
  if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; }
  if (side === 2) { x = Math.random() * canvas.width; y = 0; }
  if (side === 3) { x = Math.random() * canvas.width; y = canvas.height; }

  enemies.push({ x, y, size: 18, speed: 1.2 });
}

setInterval(spawnEnemy, 800);

// ================= ATTACK =================
const bullets = [];

setInterval(() => {
  if (enemies.length === 0) return;

  const enemy = enemies[0];
  bullets.push({
    x: player.x,
    y: player.y,
    dx: (enemy.x - player.x) / 30,
    dy: (enemy.y - player.y) / 30,
    size: 6
  });
}, 500);

// ================= GAME LOOP =================
function update() {
  // Player move (segue o dedo)
  const dx = touchX - player.x;
  const dy = touchY - player.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 1) {
    player.x += dx / dist * player.speed;
    player.y += dy / dist * player.speed;
  }

  // Enemies move
  enemies.forEach(e => {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const d = Math.hypot(dx, dy);
    e.x += dx / d * e.speed;
    e.y += dy / d * e.speed;
  });

  // Bullets move
  bullets.forEach(b => {
    b.x += b.dx;
    b.y += b.dy;
  });

  // Collision
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (Math.hypot(b.x - e.x, b.y - e.y) < e.size) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Bullets
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
