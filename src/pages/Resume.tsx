const BASE = import.meta.env.BASE_URL;

export default () => {
  return <>
    <h1>My Resume</h1>

    <p>This is my resume with my current experience and achievements.</p>

    <object data={BASE + "/resume.pdf"} height="1060" />
  </>;
};
