const car = document.getElementById("car");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

let carX = 130;
let speed = 3;
let score = 0;
let gameOver = false;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = "High: " + highScore;

/* 🎮 KEYBOARD CONTROLS */
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

/* 📱 TOUCH CONTROLS */
game.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  const rect = game.getBoundingClientRect();

  let x = touch.clientX - rect.left - 20;
  if (x < 0) x = 0;
  if (x > 260) x = 260;

  carX = x;
});

/* 🚗 GAME LOOP */
function gameLoop() {
  if (gameOver) return;

  if (keys["ArrowLeft"] && carX > 0) carX -= 5;
  if (keys["ArrowRight"] && carX < 260) carX += 5;

  car.style.left = carX + "px";

  moveEnemies();
  checkCollision();

  score++;
  scoreEl.innerText = score;

  if (score % 200 === 0) speed += 0.5;

  requestAnimationFrame(gameLoop);
}

/* 🚧 ENEMIES */
function spawnEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  enemy.style.left = Math.floor(Math.random() * 6) * 50 + "px";
  enemy.style.top = "-100px";

  game.appendChild(enemy);
}

function moveEnemies() {
  const enemies = document.querySelectorAll(".enemy");

  enemies.forEach(enemy => {
    let top = parseInt(enemy.style.top);
    top += speed;
    enemy.style.top = top + "px";

    if (top > 500) enemy.remove();
  });
}

/* 💥 COLLISION */
function checkCollision() {
  const enemies = document.querySelectorAll(".enemy");

  enemies.forEach(enemy => {
    const e = enemy.getBoundingClientRect();
    const c = car.getBoundingClientRect();

    if (
      e.left < c.right &&
      e.right > c.left &&
      e.top < c.bottom &&
      e.bottom > c.top
    ) {
      endGame();
    }
  });
}

/* 🧠 END GAME */
function endGame() {
  gameOver = true;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }

  finalScore.innerText = "Score: " + score;
  gameOverScreen.classList.remove("hidden");
}

/* 🔁 RESTART */
function restartGame() {
  location.reload();
}

/* Start systems */
setInterval(spawnEnemy, 1200);
gameLoop();
