import { Component, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./PageSwitcher.module.css";

const FPS = 10;
const MS_PER_FRAME = 1/FPS * 1000;

const BASE = new URL(import.meta.env.BASE_URL).pathname;

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

  const [currentPath, setCurrentPath] = createSignal("/");
  const setPathFromReal = (realPath: string) => {
    if (realPath.startsWith(BASE)) {
      const relPath = realPath.slice(BASE.length);
      if (relPath in props.pages) {
        setCurrentPath(relPath);
        return;
      }
    }
    setCurrentPath("/");
    history.replaceState({}, "", BASE);
  };
  setPathFromReal(location.pathname);

  const cursorIdx = createMemo(() => Object.keys(props.pages).indexOf(currentPath()));

  const pages = props.pages;

  const onPopState = () => {
    setPathFromReal(location.pathname);
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
  });
  onCleanup(() => {
    window.removeEventListener("popstate", onPopState);
  });

  return <div class={styles["switcher"]}>
    <div ref={content} class={styles["content"]}>
      <Dynamic component={props.pages[currentPath()]} />
    </div>

    <div class={styles["nav-wrapper"]}>
      <nav ref={nav} class={styles["nav"]}>
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
