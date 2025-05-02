import { Component, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./PageSwitcher.module.css";

const FPS = 10;
const MS_PER_FRAME = 1/FPS * 1000;

const BASE = import.meta.env.BASE_URL;

interface PageSwitcherProps {
  pages: { [path: string]: Component }
}

function withBase(path: string): string {
  return path.startsWith("/")
    ? BASE + path
    : BASE + "/" + path;
}

export default (props: PageSwitcherProps) => {
  let content!: HTMLDivElement;
  let nav!: HTMLElement;

  const [currentPath, setCurrentPath] = createSignal(location.pathname);
  if (!(currentPath() in props.pages)) {
    setCurrentPath("/");
    history.replaceState({}, "", BASE);
  }

  const cursorIdx = createMemo(() => Object.keys(props.pages).indexOf(currentPath()));

  const pages = props.pages;

  const onPopState = () => {
    setCurrentPath(location.pathname);
  };

  let lastScroll = window.scrollY;
  const [scrollVelocity, setScrollVelocity] = createSignal(0);

  let quit = false;
  let lastUpdate = -Infinity;
  const update = (timestamp: number) => {
    let delta = timestamp - lastUpdate;
    if (delta >= MS_PER_FRAME) {
      let diff = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      setScrollVelocity(0.99 * scrollVelocity() + 0.01 * diff);
    }
    if (!quit) requestAnimationFrame(update);
  };

  let badClicks = 0;
  let [badMsg, setBadMsg] = createSignal("I forgot to do that one...");
  let [badShown, setBadShown] = createSignal(false);
  let badTimeoutHandle: number = 0;

  const onAnchorClick = (ev: MouseEvent) => {
    let target = ev.target as HTMLElement | null;
    while (target && target.tagName.toLowerCase() !== "a") {
      target = target.parentElement;
    }
    if (!target) return;
    const a = target as HTMLAnchorElement;
    if (a.hostname !== location.hostname) return;
    ev.preventDefault();
    if (a.pathname === currentPath()) return;

    if (a.pathname === "/research" || a.pathname === "/reflection") {
      if (badClicks === 0) {
        setBadShown(true);
        badTimeoutHandle = setTimeout(() => {
          setBadShown(false);
        }, 3000);
      } else if (badClicks === 1) {
        clearTimeout(badTimeoutHandle);
        setBadShown(true);
        setBadMsg("I forgot that one too :(")
        badTimeoutHandle = setTimeout(() => {
          setBadShown(false);
        }, 3000);
      }
      let red = "#f55";
      a.animate([
        { color: "inherit", transform: "translateX(0)" },
        { color: red, transform: "translateX(5px)" },
        { color: red, transform: "translateX(-5px)" },
        { color: red, transform: "translateX(5px)" },
        { color: "inherit", transform: "translateX(0)" }
      ], {
        duration: 300,
        easing: "ease-out"
      })
      badClicks += 1;
      return ;
    }

    if (a.pathname in props.pages) {
      setCurrentPath(a.pathname);
    } else {
      setCurrentPath("/");
   }
    history.pushState({}, "", withBase(currentPath()));
  };

  onMount(() => {
    window.addEventListener("popstate", onPopState);
    requestAnimationFrame(update);
  });
  onCleanup(() => {
    window.removeEventListener("popstate", onPopState);
    quit = true;
  });

  return <div class={styles["switcher"]}>
    <div ref={content} class={styles["content"]}>
      <Dynamic component={props.pages[currentPath()]} />
    </div>

    <div class={styles["nav-wrapper"]}>
      <nav
        ref={nav}
        class={styles["nav"]}
        style={`--velocity: ${scrollVelocity()}`}
      >
        <div
          class={styles["cursor"]}
          style={`--idx: ${cursorIdx()}`}
        >&rarr;&nbsp;</div>
        <div>
          <For each={Object.keys(pages)}>{path =>
            <a href={path} onClick={onAnchorClick}>
              {path === "/" ? "/home" : path}
            </a>
          }</For>
        </div>
      </nav>
    </div>
  </div>;
};
