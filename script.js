const car = document.getElementById("car");
const game = document.getElementById("game");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

const engineSound = document.getElementById("engineSound");
const crashSound = document.getElementById("crashSound");
const bgMusic = document.getElementById("bgMusic");

let carX = 130;
let score = 0;
let speed = 4;
let gameOver = false;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = "High: " + highScore;

/* Start sound on first click */
document.body.addEventListener("click", () => {
  engineSound.play();
  bgMusic.play();
}, { once: true });

/* Keyboard */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && carX > 0) carX -= 25;
  if (e.key === "ArrowRight" && carX < 260) carX += 25;
  car.style.left = carX + "px";
});

/* Touch */
game.addEventListener("touchmove", e => {
  let x = e.touches[0].clientX - game.offsetLeft - 20;
  if (x < 0) x = 0;
  if (x > 260) x = 260;
  carX = x;
  car.style.left = carX + "px";
});

/* Enemy */
function spawnEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("img");
  enemy.src = "assets/enemy.png";
  enemy.classList.add("enemy");

  enemy.style.left = Math.floor(Math.random() * 6) * 50 + "px";
  game.appendChild(enemy);

  let top = -100;

  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      return;
    }

    top += speed;
    enemy.style.top = top + "px";

    if (
      top > 400 &&
      enemy.offsetLeft < carX + 40 &&
      enemy.offsetLeft + 40 > carX
    ) {
      crashSound.play();
      endGame();
    }

    if (top > 500) {
      enemy.remove();
      clearInterval(move);
    }
  }, 30);
}

/* Game loop */
setInterval(() => {
  if (!gameOver) {
    spawnEnemy();
    score++;
    scoreEl.innerText = score;

    if (score % 200 === 0) speed += 0.5;
  }
}, 1000);

/* End game */
function endGame() {
  gameOver = true;

  engineSound.pause();
  bgMusic.pause();

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }

  document.getElementById("finalScore").innerText = "Score: " + score;
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

/* Restart */
function restartGame() {
  location.reload();
}
