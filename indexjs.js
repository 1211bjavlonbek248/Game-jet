const buttons = document.querySelectorAll("#ol");

let coins = parseInt(localStorage.getItem("coins")) || 0;

let giftData = JSON.parse(localStorage.getItem("giftData")) || {
  current: 0,
  lastClaim: 0
};

const WAIT_TIME = 12 * 60 * 60 * 1000; // 12 soat

// Coin va rekordni chiqarish
function updateInfo() {
  const coinText = document.getElementById("coins");
  const highScoreText = document.getElementById("highScore");
  
  if (coinText) coinText.innerText = coins;
  if (highScoreText) {
    highScoreText.innerText =
      localStorage.getItem("highScore") || 0;
  }
}

// Sovg'alarni yangilash
function updateButtons() {
  const now = Date.now();
  
  buttons.forEach((btn, index) => {
    
    if (index < giftData.current) {
      btn.innerHTML = "✅";
      btn.disabled = true;
    }
    
    else if (index === giftData.current) {
      
      if (
        giftData.current === 0 ||
        now - giftData.lastClaim >= WAIT_TIME
      ) {
        btn.innerHTML = "🎁";
        btn.disabled = false;
      } else {
        btn.innerHTML = "🔒";
        btn.disabled = true;
      }
      
    }
    
    else {
      btn.innerHTML = "🔒";
      btn.disabled = true;
    }
  });
}

// Tugmalar bosilganda
buttons.forEach((btn, index) => {
  
  btn.addEventListener("click", () => {
    
    if (index !== giftData.current) return;
    
    const reward = 300 * Math.pow(2, index);
    
    coins += reward;
    
    localStorage.setItem("coins", coins);
    
    giftData.current++;
    giftData.lastClaim = Date.now();
    
    // Oxiriga yetganda boshidan boshlash
    if (giftData.current >= buttons.length) {
      giftData.current = 0;
    }
    
    localStorage.setItem(
      "giftData",
      JSON.stringify(giftData)
    );
    
    updateInfo();
    updateButtons();
    
    alert("+" + reward + " coin!");
  });
  
});

// Oyna ochish
function ok() {
  document.getElementById("kun").style.display = "none";
}
function updateTimer() {
  const timer = document.getElementById("timer");
  
  if (!timer) return;
  
  const now = Date.now();
  const passed = now - giftData.lastClaim;
  const left = WAIT_TIME - passed;
  
  if (
    giftData.current === 0 ||
    passed >= WAIT_TIME
  ) {
    timer.innerText = "Tayyor";
    return;
  }
  
  const hours = Math.floor(left / 3600000);
  const minutes = Math.floor((left % 3600000) / 60000);
  const seconds = Math.floor((left % 60000) / 1000);
  
  timer.innerText =
    String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

setInterval(updateTimer, 1000);
updateTimer();
// Boshlang'ich ishga tushirish
updateInfo();
updateButtons();

setInterval(updateButtons, 1000);