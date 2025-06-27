const container = document.getElementById("container");
    const arrows = [];
    const arrowCount = 10;
    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;
    let moveX = 0;
    let moveY = -1;
    let angleDeg = 0;

    const arrowSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
        <path d="M250,0 L500,500 L250,400 L0,500 Z" fill="white"/>
      </svg>
    `;

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

    function handleMotion(event) {
      const ag = event.accelerationIncludingGravity;
      const gx = ag.x;
      const gy = ag.y;

      const mag = Math.sqrt(gx * gx + gy * gy);
      if (mag === 0) return;

      const gxN = gx / mag;
      const gyN = gy / mag;

      let tx = gyN - gxN;
      let ty = -gxN - gyN;

      const tMag = Math.sqrt(tx * tx + ty * ty);
      if (tMag === 0) return;

      moveX = tx / tMag;
      moveY = ty / tMag;

      const angleRad = Math.atan2(moveY, moveX);
      angleDeg = angleRad * 180 / Math.PI;
    }

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

    function setup() {
      const iOS = typeof DeviceMotionEvent !== "undefined" &&
                  typeof DeviceMotionEvent.requestPermission === "function";

      if (iOS) {
        document.body.addEventListener("click", () => {
          DeviceMotionEvent.requestPermission()
            .then(res => {
              if (res === "granted") {
                window.addEventListener("devicemotion", handleMotion);
                animate();
              } else {
                alert("센서 권한이 거부됐어요!");
              }
            })
            .catch(console.error);
        }, { once: true });
      } else {
        window.addEventListener("devicemotion", handleMotion);
        animate();
      }
    }

    setup();