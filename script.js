const graphic = document.getElementById("graphic");
let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

// 움직임 처리 함수
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const x = ag.x;
  const y = ag.y;

  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude === 0) return;

  const dirX = y / magnitude;
  const dirY = -x / magnitude;

  const speed = 4;
  posX += dirX * speed;
  posY += dirY * speed;

  const w = 80;
  const h = 80;

  if (posX < -w) posX = window.innerWidth;
  if (posX > window.innerWidth) posX = -w;
  if (posY < -h) posY = window.innerHeight;
  if (posY > window.innerHeight) posY = -h;

  graphic.style.left = `${posX}px`;
  graphic.style.top = `${posY}px`;
}

// iOS 권한 요청 처리
function setupMotion() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    // Safari (iOS)
    DeviceMotionEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          console.log("✅ 권한 허용됨");
          window.addEventListener("devicemotion", handleMotion);
        } else {
          alert("센서 권한을 허용해야 움직일 수 있어요.");
        }
      })
      .catch((err) => {
        console.error("❌ 권한 요청 실패:", err);
      });
  } else {
    // Android 등
    console.log("✅ 권한 요청 없이 센서 사용 가능");
    window.addEventListener("devicemotion", handleMotion);
  }
}

// Safari는 반드시 터치 후에 권한 요청 가능
document.body.addEventListener("click", setupMotion, { once: true });
