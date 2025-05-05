const EMBED = `<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTSdQfISGVG2ceMdCYdL9T1YfsqMqSAzE2G1ERzGS341aIixuKKv9qrSuZe_idG8aYuycWa-6ADpd9J/pubembed?start=false&loop=false&delayms=30000" frameborder="0" width="792" height="481" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;

export default () => {
  return <>
    <h1>Presentation</h1>

    <p>This is my presentation covering my Senior Research Project experience.</p>

    <div innerHTML={EMBED}></div>
  </>;
};
