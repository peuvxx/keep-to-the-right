const container = document.getElementById("container");
const arrows = [];
const arrowCount = 10;
let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let dirX = 0;
let dirY = -1;
let angleDeg = 0;

// 화살표 여러 개 생성
for (let i = 0; i < arrowCount; i++) {
  const el = document.createElement("img");
  el.src = "graphic.svg"; // ← 수빈이의 실제 화살표 SVG 파일 이름!
  el.className = "arrow";
  container.appendChild(el);

  arrows.push({
    el,
    offset: i * -80 // 간격 조절
  });
}

// 센서 방향 감지
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const gx = ag.x;
  const gy = ag.y;

  const magnitude = Math.sqrt(gx * gx + gy * gy);
  if (magnitude === 0) return;

  dirX = -gx / magnitude;
  dirY = -gy / magnitude;

  const angleRad = Math.atan2(dirY, dirX);
  angleDeg = angleRad * 180 / Math.PI;
}

// 애니메이션 실행
function animate() {
  requestAnimationFrame(animate);

  const speed = 2;
  posX += dirX * speed;
  posY += dirY * speed;

  const rightX = -dirY;
  const rightY = dirX;
  const offsetFromCenter = 100;

  for (let i = 0; i < arrows.length; i++) {
    const a = arrows[i];
    const step = a.offset;

    const x = posX + dirX * step + rightX * offsetFromCenter;
    const y = posY + dirY * step + rightY * offsetFromCenter;

    a.el.style.left = `${x}px`;
    a.el.style.top = `${y}px`;
    a.el.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  }

  // 루프처럼 offset 재사용
  for (let a of arrows) {
    a.offset += speed;
    if (a.offset > 100) {
      a.offset = -arrowCount * 80;
    }
  }
}

// 센서 권한 요청 처리
function setup() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    document.body.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission()
        .then((res) => {
          if (res === "granted") {
            window.addEventListener("devicemotion", handleMotion);
            animate();
          } else {
            alert("센서 권한이 필요해요!");
          }
        })
        .catch(console.error);
    }, { once: true });
  } else {
    // Android 등
    window.addEventListener("devicemotion", handleMotion);
    animate();
  }
}

window.addEventListener("DOMContentLoaded", setup);
