const EMBED = `<iframe src="https://docs.google.com/document/d/e/2PACX-1vQChmoECc542ECv1iLOEpZIiekGnp0pDkdfp1SZDIp0TrpSSBbhkLPbtQd7NU1KDz9ZXCOyulV_uDVO/pub?embedded=true" frameborder="0" width="792" height="900"></iframe>`;

export default () => {
  return <>
    <h1>Work Log</h1>

    <p>This is what I did during my mentor shadowing experience.</p>

    <div innerHTML={EMBED}></div>
  </>;
};
