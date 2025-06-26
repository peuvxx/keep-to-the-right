const container = document.getElementById("container");
const arrows = [];
const arrowCount = 10;

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let moveX = 0;
let moveY = -1;
let angleDeg = 0;

// SVG로 된 화살표 엘리먼트 여러 개 생성
for (let i = 0; i < arrowCount; i++) {
  const img = document.createElement("img");
  img.src = "graphic.svg"; // 수빈이 svg 이름
  img.className = "arrow";
  container.appendChild(img);

  arrows.push({
    el: img,
    offset: i * -80
  });
}

// 중력 기준 우측 상단 방향 계산
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const gx = ag.x;
  const gy = ag.y;

  const magnitude = Math.sqrt(gx * gx + gy * gy);
  if (magnitude === 0) return;

  // 중력 벡터
  const gxN = gx / magnitude;
  const gyN = gy / magnitude;

  // 중력 기준의 우측 상단 방향 = 중력 반대의 법선 방향 + 상승 방향
  let tx = gyN - gxN;
  let ty = -gxN - gyN;

  const tm = Math.sqrt(tx * tx + ty * ty);
  if (tm === 0) return;

  moveX = tx / tm;
  moveY = ty / tm;

  const angleRad = Math.atan2(moveY, moveX);
  angleDeg = angleRad * 180 / Math.PI;
}

// 화살표 애니메이션
function animate() {
  requestAnimationFrame(animate);

  const speed = 2;
  posX += moveX * speed;
  posY += moveY * speed;

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

// iOS 센서 권한 요청 포함
function setup() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    document.body.addEventListener("click", () => {
      Promise.all([
        DeviceMotionEvent.requestPermission()
      ])
        .then(([motionPerm]) => {
          if (motionPerm === "granted") {
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
