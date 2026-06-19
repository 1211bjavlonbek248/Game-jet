let heartsList = [];
let maxLives = 5;
let bossBullets = [];
let lives = 3;
let coinsList = [];
let bullets = [];
let invincible = false;
let blinkCount = 0;
let visible = true;
let gameOvering = false;
let boss = null;
let bossActive = false;
let bossSpawned = false;
const music = new Audio("music.mp3");
let coins = parseInt(localStorage.getItem("coins")) || 0;
music.loop = true;
music.volume = 0.5;
const shootSound = new Audio("shoot.mp3");
const boom = document.getElementById("boom");
const explosionSound = new Audio("bom.mp3");
const bossbom = new Audio("bom.mp3");
shootSound.volume = 0.5;
document.addEventListener("touchstart", function startMusic() {
  music.play();
  document.removeEventListener("touchstart", startMusic);
});
document.getElementById("fireBtn")
  .addEventListener("touchstart", shoot);

function shoot() {
  shootSound.currentTime = 0;
shootSound.play();
  bullets.push({
    x: player.x + player.w / 2 - 5,
    y: player.y,
    w: 10,
    h: 25
  });
  
}

function spawnHeart(x, y) {
  heartsList.push({
    x: x,
    y: y,
    w: 30,
    h: 30,
    speed: 2
  });
}
function spawnBoss() {
  boss = {
    x: canvas.width / 2 - 100,
    y: -250, // tepada ekrandan tashqarida
    w: 200,
    h: 200,
    hp: 20,
    entering: true,
    canShoot: false
  };
  
  bossActive = true;
  bossSpawned = true;
}
// IMAGES
const plane = new Image();
plane.src =
  localStorage.getItem("selectedJet") || "plane.png";
  
const obstacleImg = new Image();
obstacleImg.src = "enemy.png";

const coinImg = new Image();
coinImg.src = "coin.png";

const bossImg = new Image();
bossImg.src = "boss.png";

const redStoneImg = new Image();
redStoneImg.src = "redstone.png";

const redStoneBoom = new Audio("bom.mp3");

let redStones = [];

function createRedStone() {
  redStones.push({
    x: Math.random() * (canvas.width -100),
    y: -100,
    w: 100,
    h: 100,
    hp: 3
  });
}

setInterval(createRedStone, 8000);
// CANVAS
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// PLAYER
let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height + 200,
  w: 125,
  h: 125
};

// START POSITION
let targetY = 900;
let startAnim = true;

// GAME DATA
let obstacles = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let obstacleSpeed = 5;

// TOUCH CONTROL
let targetX = player.x;

// TOUCH EVENTS
canvas.addEventListener("touchstart", e => {
  targetX = e.touches[0].clientX - player.w / 2;
});

canvas.addEventListener("touchmove", e => {
  targetX = e.touches[0].clientX - player.w / 2;
});

// OBSTACLES
function createObstacle() {
  obstacles.push({
    x: Math.random() * (canvas.width - 50),
    y: -50,
    w: 50,
    h: 50
  });
}

setInterval(createObstacle, 1200);
// coin yaratish
function createCoin() {
  coinsList.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    w: 40,
    h: 40
  });
}

setInterval(createCoin, 5000);
// GAME LOOP
function gameLoop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // QIZIL TOSHLAR
for (let i = redStones.length - 1; i >= 0; i--) {
  // QIZIL TOSH JETGA TEGISHI
if (
  !invincible &&
  redStones[i].x < player.x + player.w &&
  redStones[i].x + redStones[i].w > player.x &&
  redStones[i].y < player.y + player.h &&
  redStones[i].y + redStones[i].h > player.y
) {
  
  lives--;
  
  redStones.splice(i, 1);
  
  invincible = true;
  
  let flash = setInterval(() => {
    visible = !visible;
    blinkCount++;
    
    if (blinkCount >= 40) {
      clearInterval(flash);
      visible = true;
      blinkCount = 0;
      invincible = false;
    }
  }, 100);
  
  if (lives <= 0 && !gameOvering) {
    gameOvering = true;
    
    explosionSound.currentTime = 0;
    explosionSound.play();
    
    boom.style.display = "block";
    boom.style.left = (player.x - 60) + "px";
    boom.style.top = (player.y - 60) + "px";
    
    setTimeout(() => {
      window.location.href = "gameover.html";
    }, 1000);
  }
  
  continue; // ← SHU SATR YO‘QOLGAN
}
  redStones[i].y += obstacleSpeed;
  
  ctx.drawImage(
    redStoneImg,
    redStones[i].x,
    redStones[i].y,
    redStones[i].w,
    redStones[i].h
  );
  
  // HP KO'RSATISH
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(
    redStones[i].hp,
    redStones[i].x + 25,
    redStones[i].y - 5
  );
  
  // O'Q TEGISHI
  for (let b = bullets.length - 1; b >= 0; b--) {
    
    if (
      bullets[b] &&
      bullets[b].x < redStones[i].x + redStones[i].w &&
      bullets[b].x + bullets[b].w > redStones[i].x &&
      bullets[b].y < redStones[i].y + redStones[i].h &&
      bullets[b].y + bullets[b].h > redStones[i].y
    ) {
      
      bullets.splice(b, 1);
      
      redStones[i].hp--;
      
      if (redStones[i].hp <= 0) {
        
        redStoneBoom.currentTime = 0;
        redStoneBoom.play();
        
        boom.style.display = "block";
        boom.style.left =
  (redStones[i].x + redStones[i].w / 2 - boom.offsetWidth / 2) + "px";

boom.style.top =
  (redStones[i].y + redStones[i].h / 2 - boom.offsetHeight / 2) + "px";
        
        setTimeout(() => {
          boom.style.display = "none";
        }, 500);
        
        redStones.splice(i, 1);
        
        score += 10;
        coins += 50;
        
        localStorage.setItem("coins", coins);
      }
      
      break;
    }
  }
  
  // EKRANDAN CHIQIB KETSA
  if (i < redStones.length && redStones[i].y > canvas.height) {
    redStones.splice(i, 1);
  }
}
  
  for (let i = coinsList.length - 1; i >= 0; i--) {
  
  coinsList[i].y += 4;
  
  ctx.drawImage(
    coinImg,
    coinsList[i].x,
    coinsList[i].y,
    coinsList[i].w,
    coinsList[i].h
  );
  
  if (
    player.x < coinsList[i].x + coinsList[i].w &&
    player.x + player.w > coinsList[i].x &&
    player.y < coinsList[i].y + coinsList[i].h &&
    player.y + player.h > coinsList[i].y
  ) {
    
    coins += 20;
    
    localStorage.setItem("coins", coins);
    
    coinsList.splice(i, 1);
    continue;
  }
  
  if (coinsList[i].y > canvas.height) {
    coinsList.splice(i, 1);
  }
}
  // START ANIMATION
  if (startAnim) {
    player.y -= 10;
    
    if (player.y <= targetY) {
      player.y = targetY;
      startAnim = false;
    }
  }
  
  // SMOOTH MOVE LEFT/RIGHT
  player.x += (targetX - player.x) * 0.15;
  
  // LIMIT
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.w)
    player.x = canvas.width - player.w;
  
  // SCORE
  ctx.fillStyle = "white";
  ctx.font = "25px Arial";
  ctx.fillText("Ball: " + score, 20, 40);
  ctx.fillText("Rekord: " + highScore, 20, 75);
  if (score >= 50 && !bossSpawned) {
  spawnBoss();
}
  ctx.fillText("❤️: " + lives, 20, 110);
ctx.fillText("💰: " + coins, 20, 145);
  // =========================
  // ✈️ PLAYER DRAW (BANKING EFFECT)
  // =========================
  
  ctx.save();
  
  let centerX = player.x + player.w / 2;
  let centerY = player.y + player.h / 2;
  
  ctx.translate(centerX, centerY);
  
  // banking angle
  let angle = (targetX - player.x) * 0.003;
  
  if (angle > 0.35) angle = 0.35;
  if (angle < -0.35) angle = -0.35;
  
  ctx.rotate(angle);
  
  if (visible) {
  
  ctx.drawImage(
    plane,
    -player.w / 2,
    -player.h / 2,
    player.w,
    player.h
  );
  
}
  
  ctx.restore();
  
  // =========================
  // OBSTACLES
  // =========================
  
  for (let i = obstacles.length - 1; i >= 0; i--) {
    
    obstacles[i].y += obstacleSpeed;
    
    ctx.drawImage(
      obstacleImg,
      obstacles[i].x,
      obstacles[i].y,
      obstacles[i].w,
      obstacles[i].h
    );
    
    if (bossActive && boss) {
  // Boss tepadan tushishi
if (boss.entering) {
  
  boss.y += 2;
  
  if (boss.y >= 50) {
    
    boss.y = 50;
    boss.entering = false;
    
    setTimeout(() => {
      if (boss) boss.canShoot = true;
    }, 1000);
    
  }
  
}
  
  ctx.drawImage(
    bossImg,
    boss.x,
    boss.y,
    boss.w,
    boss.h
  );
  
  ctx.fillStyle = "red";
  ctx.fillRect(
    boss.x,
    boss.y - 20,
    boss.hp * 10,
    10
  );
    // === BOSS MOVE (chap-o‘ng yurish) ===
  if (!boss.entering) {
  boss.x += Math.sin(Date.now() * 0.002) * 3;
}
  
  // === BOSS SHOOT (ikki tomondan) ===
  if (boss.canShoot && Math.random() < 0.03) {
    
    // chap qurol
    bossBullets.push({
      x: boss.x + 20,
      y: boss.y + boss.h,
      w: 8,
      h: 15,
      speed: 6
    });
    
    // o‘ng qurol
    bossBullets.push({
      x: boss.x + boss.w - 28,
      y: boss.y + boss.h,
      w: 8,
      h: 15,
      speed: 6
    });
  }
  
  ctx.drawImage(
    bossImg,
    boss.x,
    boss.y,
    boss.w,
    boss.h
  );
}
    // COLLISION
if (
  !invincible &&
  player.x < obstacles[i].x + obstacles[i].w &&
  player.x + player.w > obstacles[i].x &&
  player.y < obstacles[i].y + obstacles[i].h &&
  player.y + player.h > obstacles[i].y
) {
  
  lives--;
  
  obstacles.splice(i, 1);
  
  invincible = true;
  
  let flash = setInterval(() => {
    
    visible = !visible;
    
    blinkCount++;
    
    if (blinkCount >= 40) {
      
      clearInterval(flash);
      
      visible = true;
      blinkCount = 0;
      invincible = false;
      
    }
    
  }, 100);
  
  if (lives <= 0 && !gameOvering) {
  
  gameOvering = true;
  
  explosionSound.play();
  
  boom.style.display = "block";
  
  boom.style.left = (player.x - 60) + "px";
  boom.style.top = (player.y - 60) + "px";
  
  setTimeout(() => {
    
    localStorage.setItem("lastScore", score);
    localStorage.setItem("coins", coins);
    
    window.location.href = "gameover.html";
    
  }, 1000);
  
  return;
}
  
  continue;
}
    
    
    // REMOVE + SCORE
    if (obstacles[i].y > canvas.height) {
      score++;
      coins++;
localStorage.setItem("coins", coins);
      
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
      
      if (score % 5 === 0) {
        obstacleSpeed++;
      }
      
      obstacles.splice(i, 1);
    }
  }
  
  // BULLETS

for (let b = bullets.length - 1; b >= 0; b--) {
  
  bullets[b].y -= 15;
  
  ctx.fillStyle = "white";
  
  ctx.fillRect(
    bullets[b].x,
    bullets[b].y,
    bullets[b].w,
    bullets[b].h
  );
  
  if (bullets[b].y < -50) {
    bullets.splice(b, 1);
    continue;
  }
  if (bossActive && boss) {
  
  if (
    bullets[b].x < boss.x + boss.w &&
    bullets[b].x + bullets[b].w > boss.x &&
    bullets[b].y < boss.y + boss.h &&
    bullets[b].y + bullets[b].h > boss.y
  ) {
    
    bullets.splice(b, 1);
    
    boss.hp--;
    
if (boss.hp <= 0) {
  
  spawnHeart(boss.x + boss.w / 2, boss.y + boss.h / 2);
  
  bossbom.play();
  
  boom.style.display = "block";
  boom.style.left = boss.x + "px";
  boom.style.top = boss.y + "px";
  
  setTimeout(() => {
    boom.style.display = "none";
  }, 800);
  
  score += 80;
  coins += 200;
  
  localStorage.setItem("coins", coins);
  
  bossActive = false;
  boss = null;
}
    continue;
  }
}
  for (let i = obstacles.length - 1; i >= 0; i--) {
    
    if (
      
      bullets[b] &&
      bullets[b].x < obstacles[i].x + obstacles[i].w &&
      bullets[b].x + bullets[b].w > obstacles[i].x &&
      bullets[b].y < obstacles[i].y + obstacles[i].h &&
      bullets[b].y + bullets[b].h > obstacles[i].y
      
    ) {
      
      bullets.splice(b, 1);
      obstacles.splice(i, 1);
      
      score += 2;
      coins += 1;

      localStorage.setItem("coins", coins);
      if (score === 50 && !bossActive) {
  spawnBoss();
}
      break;
    }
  }
}
// OBSTACLES FOR TUGADI

if (bossActive && boss) {
  
  ctx.drawImage(
    bossImg,
    boss.x,
    boss.y,
    boss.w,
    boss.h
  );
  
  ctx.fillStyle = "red";
  ctx.fillRect(
    boss.x,
    boss.y - 20,
    boss.hp * 10,
    10
  );
  for (let i = bossBullets.length - 1; i >= 0; i--) {
  
  bossBullets[i].y += bossBullets[i].speed;
  
  ctx.fillStyle = "red";
  ctx.fillRect(
    bossBullets[i].x,
    bossBullets[i].y,
    bossBullets[i].w,
    bossBullets[i].h
  );
  
  // === PLAYER COLLISION ===
  if (
    !invincible &&
    bossBullets[i].x < player.x + player.w &&
    bossBullets[i].x + bossBullets[i].w > player.x &&
    bossBullets[i].y < player.y + player.h &&
    bossBullets[i].y + bossBullets[i].h > player.y
  ) {
    
    bossBullets.splice(i, 1);
    invincible = true;
    blinkCount = 0;
let flash = setInterval(() => {
  
  visible = !visible;
  
  blinkCount++;
  
  if (blinkCount >= 40) {
    
    clearInterval(flash);
    
    visible = true;
    invincible = false;
    
  }
  
}, 100);

    lives--;
    
    if (lives <= 0) {
      if (lives <= 0 && !gameOvering) {
  
  gameOvering = true;
  
  explosionSound.play(); // 🔊 PORTLASH OVOZI
  
  boom.style.display = "block"; // 💥 PORTLASH RASMI
  
  boom.style.left = (player.x - 60) + "px";
  boom.style.top = (player.y - 60) + "px";
  
  setTimeout(() => {
    
    localStorage.setItem("lastScore", score);
    localStorage.setItem("coins", coins);
    window.location.href = "gameover.html";
  }, 1000);
}
    }
    
    continue;
  }
  
  // remove off screen
  if (bossBullets[i].y > canvas.height) {
    bossBullets.splice(i, 1);
    
  }
}
}
// ❤️ HEART UPDATE
for (let i = heartsList.length - 1; i >= 0; i--) {
  
  let h = heartsList[i];
  if (!h) continue;
  
  h.y += h.speed || 2;
  
  ctx.font = "30px Arial";
  ctx.fillText("❤️", h.x, h.y);
  
  // PLAYER TO‘QNASHUV
  if (
    player.x < h.x + 30 &&
    player.x + player.w > h.x &&
    player.y < h.y + 30 &&
    player.y + player.h > h.y
  ) {
    if (lives < maxLives) {
      lives+=2;
    }
    heartsList.splice(i, 1);
    continue;
  }
  
  // EKRANDAN CHIQSA O‘CHIR
  if (h.y > canvas.height + 50) {
    heartsList.splice(i, 1);
  }
}
requestAnimationFrame(gameLoop);
}

gameLoop();