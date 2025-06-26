const graphic = document.getElementById("graphic");

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

function handleMotion(event) {
  const ag = event.accelerationIncludingGravity;
  const x = ag.x;
  const y = ag.y;

  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude === 0) return;

  // 중력 반대 방향 (직진 방향)
  const dirX = -x / magnitude;
  const dirY = -y / magnitude;

  // 중력 반대 방향의 우측 방향 (법선 벡터)
  const rightX = -dirY;
  const rightY = dirX;

  const offset = 100; // 오른쪽으로 떨어진 위치에 그리기
  const newX = posX + rightX * offset;
  const newY = posY + rightY * offset;

  // 이동 (직진)
  const speed = 2;
  posX += dirX * speed;
  posY += dirY * speed;

  // 회전각도 계산 (전진 방향 기준)
  const angleRad = Math.atan2(dirY, dirX);
  const angleDeg = angleRad * (180 / Math.PI);

  graphic.style.left = `${newX}px`;
  graphic.style.top = `${newY}px`;
  graphic.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
}

// 권한 요청 포함
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
          } else {
            alert("센서 권한이 필요해요!");
          }
        })
        .catch(console.error);
    });
  } else {
    window.addEventListener("devicemotion", handleMotion);
  }
}

setup();

