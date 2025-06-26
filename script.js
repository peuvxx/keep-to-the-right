const container = document.getElementById("container");
const arrows = [];
const arrowCount = 10;
let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let moveX = 0;
let moveY = -1;
let angleDeg = 0;

// 수빈이의 graphic.svg inline 삽입
const arrowSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <path d="M250,0 L500,500 L250,400 L0,500 Z" fill="white"/>
</svg>
`;

// 화살표 여러 개 생성
for (let i = 0; i < arrowCount; i++) {
  const div = document.createElement("div");
  div.className = "arrow";
  div.innerHTML = arrowSVG;
  container.appendChild(div);

  arrows.push({
    el: div,
    offset: i * -80
  });
}

// 센서 방향 감지 → 항상 중력 방향 기준으로 우측 상단 이동 방향 고정
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const gx = ag.x;
  const gy = ag.y;

  const magnitude = Math.sqrt(gx * gx + gy * gy);
  if (magnitude === 0) return;

  // 중력 방향 벡터
  const nx = gx / magnitude;
  const ny = gy / magnitude;

  // 우측 상단 방향 계산: 중력 방향 기준으로 90도 회전 + 위쪽 성분 강화
  moveX = ny - nx;
  moveY = -nx - ny;

  const moveMag = Math.sqrt(moveX * moveX + moveY * moveY);
  moveX /= moveMag;
  moveY /= moveMag;

  const angleRad = Math.atan2(moveY, moveX);
  angleDeg = angleRad * 180 / Math.PI;
}

// 애니메이션 실행
function animate() {
  requestAnimationFrame(animate);

  const speed = 2;
  posX += moveX * speed;
  posY += moveY * speed;

  // 항상 방향 기준 오른쪽 벡터
  const rightX = -moveY;
  const rightY = moveX;
  const offsetFromCenter = 100;

  for (let i = 0; i < arrows.length; i++) {
    const a = arrows[i];
    const step = a.offset;

    const x = posX + moveX * step + rightX * offsetFromCenter;
    const y = posY + moveY * step + rightY * offsetFromCenter;

    a.el.style.left = `${x}px`;
    a.el.style.top = `${y}px`;
    a.el.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
  }

  for (let a of arrows) {
    a.offset += speed;
    if (a.offset > 100) {
      a.offset = -arrowCount * 80;
    }
  }
}

// 센서 권한 요청 (iOS 대응)
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
    window.addEventListener("devicemotion", handleMotion);
    animate();
  }
}

window.addEventListener("DOMContentLoaded", setup);
