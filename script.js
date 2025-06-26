const container = document.getElementById("container");
const arrows = [];
const arrowCount = 10;

// 초기 화살표 여러 개 생성
for (let i = 0; i < arrowCount; i++) {
  const el = document.createElement("img");
  el.src = "graphic.svg"; // 수빈이 SVG 이름에 맞게 교체
  el.className = "arrow";
  container.appendChild(el);

  arrows.push({
    el,
    // 거리 간격 설정
    offset: i * -80
  });
}

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

let dirX = 0;
let dirY = -1;
let angleDeg = 0;

// 중력 반대 방향 계산
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const gx = ag.x;
  const gy = ag.y;

  const magnitude = Math.sqrt(gx * gx + gy * gy);
  if (magnitude === 0) return;

  dirX = -gx / magnitude;
  dirY = -gy / magnitude;

  // 회전 각도 계산
  const angleRad = Math.atan2(dirY, dirX);
  angleDeg = angleRad * 180 / Math.PI;
}

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  // 전진
  const speed = 2;
  posX += dirX * speed;
  posY += dirY * speed;

  // 우측 방향(법선 벡터)
  const rightX = -dirY;
  const rightY = dirX;

  const offsetFromCenter = 100;

  // 각 화살표 배치
  for (let i = 0; i < arrows.length; i++) {
    const a = arrows[i];
    const step = a.offset;

    const x = posX + dirX * step + rightX * offsetFromCenter;
    const y = posY + dirY * step + rightY * offsetFromCenter;

    a.el.style.left = `${x}px`;
    a.el.style.top = `${y}px`;
    a.el.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  }

  // 루프 거리 재사용
  for (let a of arrows) {
    a.offset += speed;
    if (a.offset > 100) {
      a.offset = -arrowCount * 80;
    }
  }
}

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
    });
  } else {
    window.addEventListener("devicemotion", handleMotion);
    animate();
  }
}

setup();
