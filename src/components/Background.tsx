import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

import styles from "./Background.module.css";

const FPS = 20;
const MS_PER_FRAME = 1/FPS * 1000;

function createPathD(w: number, h: number, gap: number): string {
  let out = "";
  const vc = Math.floor(w / gap);
  const hc = Math.floor(h / gap);

  for (let i of Array(vc).keys()) {
    out += `M ${(i + 1) * gap} 0 l 0 ${h} `;
  }
  for (let i of Array(hc).keys()) {
    out += `M 0 ${(i + 1) * gap} l ${w} 0 `;
  }
  return out;
}
function createCrossPathD(w: number, h: number, gap: number): string {
  let out = "";
  const vc = Math.floor(w / gap);
  const hc = Math.floor(h / gap);
  const len = Math.SQRT2 * Math.max(w, h);

  for (let i of Array(vc + hc + 1).keys()) {
    let n = i - hc;
    out += `M ${n * gap} 0 l ${len} ${len} `;
  }
  for (let i of (Array(vc + hc + 1).keys())) {
    let n = i + 1;
    out += `M 0 ${n * gap} l ${len} ${-len}`
  }
  return out;
}

export default () => {
  const [width, setWidth] = createSignal(window.innerWidth);
  const [height, setHeight] = createSignal(window.innerHeight);
  const [cursorX, setCursorX] = createSignal(0);
  const [cursorY, setCursorY] = createSignal(0);

  const smallPathD = createMemo(() => createPathD(width(), height(), 20));
  const bigPathD = createMemo(() => createPathD(width(), height(), 60));
  const crossPathD = createMemo(() => createCrossPathD(width(), height(), 240));

  let realCursorX = 0;
  let realCursorY = 0;
  const onMouseMove = (ev: MouseEvent) => {
    realCursorX = ev.clientX;
    realCursorY = ev.clientY;
  };
  
  let quit = false;
  let lastUpdate = -Infinity;
  const update = (timestamp: number) => {
    let delta = timestamp - lastUpdate;
    if (delta >= MS_PER_FRAME) {
      lastUpdate = timestamp;
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setCursorX(realCursorX);
      setCursorY(realCursorY);
    }
    if (!quit) requestAnimationFrame(update);
  };

  let mounted = false;
  onMount(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      mounted = true;
      window.addEventListener("mousemove", onMouseMove);
      requestAnimationFrame(update);
    }
  });
  onCleanup(() => {
    if (mounted) {
      window.removeEventListener("mousemove", onMouseMove);
      quit = true;
    }
  });

  return <svg
    class={styles["bg"]}
    xmlns="https://www.w3.org/2000/svg"
    viewBox={`0 0 ${width()} ${height()}`}
  >
    <defs>
      <radialGradient
        id="cursorGlow1"
        gradientUnits="userSpaceOnUse"
        cx={cursorX()}
        cy={cursorY()}
        r="300"
      >
        <stop offset="0%" stop-color="var(--color-bg-focus1)" />
        <stop offset="25%" stop-color="var(--color-bg-focus2)" />
        <stop offset="100%" stop-color="var(--color-bg-faint1)" />
      </radialGradient>
      <radialGradient
        id="cursorGlow2"
        gradientUnits="userSpaceOnUse"
        cx={cursorX()}
        cy={cursorY()}
        r="300"
      >
        <stop offset="25%" stop-color="var(--color-bg-cross1)" />
        <stop offset="100%" stop-color="var(--color-bg-cross2)" />
      </radialGradient>
      <radialGradient
        id="cursorHide"
        gradientUnits="userSpaceOnUse"
        cx={cursorX()}
        cy={cursorY()}
        r="300"
      >
        <stop offset="25%" stop-color="var(--color-bg-faint2)" />
        <stop offset="100%" stop-color="var(--color-bg-faint1)" />
      </radialGradient>
    </defs>

    <path d={smallPathD()} fill="none" stroke="url(#cursorHide)" />
    <path d={bigPathD()} fill="none" stroke="url(#cursorGlow1)" />
    <path d={crossPathD()} fill="none" stroke="url(#cursorGlow2)">
    </path>
  </svg>;
};
