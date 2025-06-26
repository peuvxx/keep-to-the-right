const graphic = document.getElementById("graphic");

let rotation = 0;

// 현재 기기 방향을 기준으로 화면 내 우측 위치 계산
function updatePosition(beta, gamma) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // 화면 기준의 우측 방향 추정 (기기 기울기에 따라 조절)
  // 기본: 화면 중심에서 오른쪽으로 offset
  const offset = 100;

  let x = w / 2 + (gamma / 90) * (w / 2 - offset);  // 좌우 기울임 기준 위치
  let y = h / 2 - (beta / 90) * (h / 2 - offset);   // 상하 기울임 기준 위치

  // 안전한 범위 내로 제한
  x = Math.max(40, Math.min(x, w - 40));
  y = Math.max(40, Math.min(y, h - 40));

  graphic.style.left = `${x}px`;
  graphic.style.top = `${y}px`;
}

// 중력 방향 기준으로 회전 각도 계산
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const x = ag.x;
  const y = ag.y;

  const angleRad = Math.atan2(y, x);
  rotation = angleRad * (180 / Math.PI) + 90;

  graphic.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
}

// 기기 회전 방향에 따라 위치 조정
function handleOrientation(event) {
  const beta = event.beta;   // front-back tilt
  const gamma = event.gamma; // left-right tilt
  updatePosition(beta, gamma);
}

// iOS 권한 요청 포함
function setup() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    document.body.addEventListener("click", () => {
      Promise.all([
        DeviceMotionEvent.requestPermission(),
        DeviceOrientationEvent.requestPermission()
      ])
        .then(([motionRes, orientRes]) => {
          if (motionRes === "granted" && orientRes === "granted") {
            window.addEventListener("devicemotion", handleMotion);
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            alert("센서 권한이 필요해요 📱");
          }
        })
        .catch(console.error);
    });
  } else {
    // Android 등
    window.addEventListener("devicemotion", handleMotion);
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

setup();
