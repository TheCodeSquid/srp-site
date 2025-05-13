import styles from "./Home.module.css";

const BASE = import.meta.env.BASE_URL;

export default () => {
  return <>
    <div class={styles["heading"]}>
      <div class={styles["title"]}>
        <h1>
          <span class={styles["soft"]}>Hi, my name is</span><br/>
          Diego Sesmas Estrada
        </h1>
        <p>
          I'm a hobbyist software developer and graphic designer.
        </p>
      </div>
      <div class={styles["image"]}>
        <img alt="me" src={`${BASE}/me.png`} />
      </div>
    </div>

    <hr/>

    <p class={styles["topic"]}>
      My Senior Research Project topic is <strong>Software Development</strong>.
    </p>

    <p style="margin: 0">
      I chose this topic because I've been tinkering with computers ever since I was 5.
      I first saw websites in my school's computer lab, and I felt the need to know how they work.
    </p>
    <p>
      Since then, I've been gathering as much knowledge and experience in as many aspects of computer science as I can,
      ranging from bare-metal embedded systems that border on writing raw 1's and 0's,
      to interactive visuals like those of this website.
    </p>
    <p>
      You can navigate this site using the links on the right.
    </p>
  </>;
};
