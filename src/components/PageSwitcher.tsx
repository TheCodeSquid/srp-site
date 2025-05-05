import { Component, createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";

import styles from "./PageSwitcher.module.css";

const BASE = import.meta.env.BASE_URL;

interface PageSwitcherProps {
  pages: { [path: string]: Component }
}

console.log(BASE);

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

  let badClicks = new Set<string>();
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

    const relPath = a.pathname.slice(BASE.length);
    if (relPath === currentPath()) return;

    if (relPath === "/research" || relPath === "/reflection") {
      if (badClicks.size === 0) {
        setBadShown(true);
        badTimeoutHandle = setTimeout(() => {
          setBadShown(false);
        }, 3000);
      } else if (badClicks.size === 1 && (
        (relPath === "/research" && badClicks.has("/reflection"))
        || (relPath === "/reflection" && badClicks.has("/research"))
      )) {
        clearTimeout(badTimeoutHandle);
        setBadShown(true);
        setBadMsg("I forgot that one too :(")
        badTimeoutHandle = setTimeout(() => {
          setBadShown(false);
        }, 3000);
      }
      let red = "var(--color-error)";
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
      badClicks.add(relPath);
      return ;
    }

    if (relPath in props.pages) {
      setCurrentPath(relPath);
    } else {
      setCurrentPath("/");
   }
    history.pushState({}, "", a.pathname);
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
            <a href={BASE+path} onClick={onAnchorClick}>
              {path === "/" ? "/home" : path}
            </a>
          }</For>
        </div>
      </nav>

      <div classList={{
        [styles["bad-msg-wrapper"]]: true,
        [styles["shown"]]: badShown(),
      }}>
        <div class={styles["bad-msg"]}>
          {badMsg()}
        </div>
      </div>
    </div>
  </div>;
};
