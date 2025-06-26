const container = document.getElementById("container");
const arrows = [];
const arrowCount = 10;

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;
let moveX = 0;
let moveY = -1;
let angleDeg = 0;

// SVG 이미지 여러 개 생성
for (let i = 0; i < arrowCount; i++) {
  const img = document.createElement("img");
  img.src = "graphic.svg"; // 수빈이 파일 graphic.svg 사용
  img.className = "arrow";
  container.appendChild(img);

  arrows.push({
    el: img,
    offset: i * -80
  });
}

// 센서 데이터로 방향 계산
function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const gx = ag.x;
  const gy = ag.y;

  const magnitude = Math.sqrt(gx * gx + gy * gy);
  if (magnitude === 0) return;

  const gxN = gx / magnitude;
  const gyN = gy / magnitude;

  // 우측 상단 방향 벡터 계산 (중력 기준)
  let tx = gyN - gxN;
  let ty = -gxN - gyN;

  const tm = Math.sqrt(tx * tx + ty * ty);
  if (tm === 0) return;

  moveX = tx / tm;
  moveY = ty / tm;

  const angleRad = Math.atan2(moveY, moveX);
  angleDeg = angleRad * 180 / Math.PI;
}

// 애니메이션 실행
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

// iOS 권한 요청 포함 센서 초기화
function setup() {
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    document.body.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
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
