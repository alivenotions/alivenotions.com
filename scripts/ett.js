const CARDS = [
  "/flowers.jpg",
  "/repetition.jpg",
  "/anxiety.jpg",
  "/empty.jpg",
];

const SCALE_MIN = 0.5;
const SCALE_MAX = 2;

function getRandomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function rubberband(value, min, max) {
  if (value < min) {
    const over = min - value;
    return min - over * 0.35;
  }
  if (value > max) {
    const over = value - max;
    return max + over * 0.35;
  }
  return value;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

function angle(a, b) {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function applyTransform(el, state) {
  el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale}) rotate(${state.rotateZ}deg)`;
}

function createCard(url, rotateZ) {
  const el = document.createElement("div");
  el.className = "card";
  el.style.backgroundImage = `url(${url})`;
  applyTransform(el, { x: 0, y: 0, scale: 1, rotateZ });

  const state = { x: 0, y: 0, scale: 1, rotateZ };
  const pointers = new Map();
  let dragStart = null;
  let pinchStart = null;

  function update() {
    applyTransform(el, state);
  }

  el.addEventListener("pointerdown", (event) => {
    el.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      dragStart = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        x: state.x,
        y: state.y,
      };
      pinchStart = null;
    } else if (pointers.size === 2) {
      dragStart = null;
      const pts = [...pointers.values()];
      const origin = midpoint(pts[0], pts[1]);
      const rect = el.getBoundingClientRect();
      const tx = origin.x - (rect.left + rect.width / 2);
      const ty = origin.y - (rect.top + rect.height / 2);

      pinchStart = {
        distance: distance(pts[0], pts[1]),
        angle: angle(pts[0], pts[1]),
        originX: origin.x,
        originY: origin.y,
        x: state.x,
        y: state.y,
        scale: state.scale,
        rotateZ: state.rotateZ,
        tx,
        ty,
      };
    }
  });

  el.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2 && pinchStart) {
      const pts = [...pointers.values()];
      const currentDistance = distance(pts[0], pts[1]);
      const currentAngle = angle(pts[0], pts[1]);
      const scaleDelta = currentDistance / pinchStart.distance;
      const nextScale = rubberband(
        pinchStart.scale * scaleDelta,
        SCALE_MIN,
        SCALE_MAX
      );
      const rotateDelta = currentAngle - pinchStart.angle;

      state.scale = nextScale;
      state.rotateZ = pinchStart.rotateZ + rotateDelta;
      state.x = pinchStart.x - (nextScale - pinchStart.scale) * pinchStart.tx;
      state.y = pinchStart.y - (nextScale - pinchStart.scale) * pinchStart.ty;
      update();
      return;
    }

    if (pointers.size === 1 && dragStart) {
      state.x = dragStart.x + (event.clientX - dragStart.pointerX);
      state.y = dragStart.y + (event.clientY - dragStart.pointerY);
      update();
    }
  });

  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size === 0) {
      dragStart = null;
      pinchStart = null;
      state.scale = clamp(state.scale, SCALE_MIN, SCALE_MAX);
      update();
    } else if (pointers.size === 1) {
      pinchStart = null;
      const remaining = [...pointers.entries()][0];
      dragStart = {
        pointerX: remaining[1].x,
        pointerY: remaining[1].y,
        x: state.x,
        y: state.y,
      };
    }
  }

  el.addEventListener("pointerup", endPointer);
  el.addEventListener("pointercancel", endPointer);

  return el;
}

function preventGestureZoom(event) {
  event.preventDefault();
}

document.addEventListener("gesturestart", preventGestureZoom);
document.addEventListener("gesturechange", preventGestureZoom);
document.addEventListener("gestureend", preventGestureZoom);

const container = document.getElementById("cards");
const caption = container.querySelector("p");

for (const url of CARDS) {
  container.insertBefore(createCard(url, getRandomRange(-17, 17)), caption);
}
