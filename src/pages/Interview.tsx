import { For, Show } from "solid-js";

import styles from "./Interview.module.css";
import text from "./interview.txt?raw";

interface Entry {
  question?: number;
  speaker: string
  text: string
}

const groups = /(?:(\d+). )?(?:(\w): )?(.*)/

const entries: Entry[] = [];

const lines = text.split("\n");
for (const line of lines) {
  const g = line.match(groups);
  if (!g) continue;
  if (g[1] || g[2]) {
    entries.push({
      question: parseInt(g[1]),
      speaker: g[2],
      text: g[3].trim(),
    });
  } else {
    entries[entries.length - 1].text += ` ${g[3].trim()}`;
  }
}

const Question = (props: { number: number }) => (
  <div class={styles["question"]}>Question #{props.number}</div>
);

export default () => {
  return <>
    <h1>Mentor Interview</h1>

    <p>
      This is my mentor interview, transcribed from the 40 minute audio recording
      (so, unfortunately, the grammar is not perfect).
    </p>

    <hr />

    <div>
      <For each={entries}>{entry => <p>
        <Show when={!!entry.question}><Question number={entry.question!} /></Show>
        <strong>{entry.speaker}:</strong>&nbsp;
        {entry.text}
      </p>}</For>
    </div>
  </>;
};
