import Background from "./components/Background";
import PageSwitcher from "./components/PageSwitcher";

import Home from "./pages/Home";
import Research from "./pages/Research";
import Interview from "./pages/Interview";
import Resume from "./pages/Resume";
import WorkLog from "./pages/WorkLog";
import Reflection from "./pages/Reflection";
import Presentation from "./pages/Presentation";

export default () => {
  return <>
    <Background />
    <PageSwitcher pages={{
      "/": Home,
      "/resume": Resume,
      "/interview": Interview,
      "/work_log": WorkLog,
      "/research": Research,
      "/presentation": Presentation,
      "/reflection": Reflection,
    }} />
  </>;
};
